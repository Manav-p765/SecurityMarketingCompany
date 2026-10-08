import { v2 as cloudinary } from 'cloudinary';

/**
 * Image storage on Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
 * CLOUDINARY_API_SECRET). Uploads are resized on Cloudinary's side to at
 * most MAX_WIDTH pixels wide and stored in the "smc-blog" folder.
 *
 * `images.provider` is swappable so tests can run without Cloudinary.
 */
export const MAX_BYTES = 5 * 1024 * 1024;
export const MAX_WIDTH = 1600;
const FOLDER = 'smc-blog';

/** jpg, png or webp, judged by the file's first bytes rather than its name. */
export function detectImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return null;
}

/**
 * What went wrong with a Cloudinary call, in words an editor can act on.
 * `config` is true when the server's Cloudinary settings are at fault (wrong
 * cloud name, key or secret) rather than the image or the network; `detail`
 * is Cloudinary's own message, for logs and the admin health panel.
 */
export function describeImageError(err) {
  const detail = err?.error?.message || err?.message || String(err);
  const code = err?.error?.http_code || err?.http_code;
  if (code === 401 || code === 403 || /cloud_name|api_key|api key|signature|disabled/i.test(detail)) {
    return {
      config: true,
      message:
        'Image uploads are not configured correctly on the server: Cloudinary rejected the account settings. Ask an admin to check the Cloudinary settings.',
      detail,
    };
  }
  if (code === 499 || /timeout|timed out|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN/i.test(detail)) {
    return { config: false, message: 'The image service did not respond in time. Please try again.', detail };
  }
  if (/invalid image|unsupported|corrupt/i.test(detail)) {
    return { config: false, message: 'That file could not be read as an image. Save it again as a JPG, PNG or WebP and retry.', detail };
  }
  return { config: false, message: `The image could not be uploaded: ${detail}`, detail };
}

const configure = () =>
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });

const cloudinaryProvider = {
  isConfigured: () =>
    Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),

  /** Throws unless Cloudinary accepts the credentials (Admin API ping). */
  async check() {
    configure();
    await cloudinary.api.ping();
  },

  upload(buffer) {
    configure();
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: FOLDER,
          resource_type: 'image',
          timeout: 60_000,
          // Resize once on upload: never wider than MAX_WIDTH, quality tuned.
          transformation: [{ width: MAX_WIDTH, crop: 'limit' }, { quality: 'auto:good' }],
        },
        (error, result) =>
          error
            ? reject(error)
            : resolve({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height })
      );
      stream.end(buffer);
    });
  },

  async remove(publicId) {
    configure();
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  },
};

export const images = {
  provider: cloudinaryProvider,
  isConfigured: () => images.provider.isConfigured(),
  upload: (buffer) => images.provider.upload(buffer),
  /** { ok, error } — whether Cloudinary is configured and accepts the account. */
  async check() {
    if (!images.isConfigured()) {
      return { ok: false, error: 'Not configured: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.' };
    }
    try {
      await images.provider.check();
      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: describeImageError(err).detail };
    }
  },
  /** Best effort: a failed delete is logged, never fatal. */
  async remove(publicId) {
    if (!publicId || !images.provider.isConfigured()) return;
    try {
      await images.provider.remove(publicId);
    } catch (err) {
      console.error(`[images] could not delete ${publicId}:`, err.message);
    }
  },
};
