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

const cloudinaryProvider = {
  isConfigured: () =>
    Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),

  upload(buffer) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: FOLDER,
          resource_type: 'image',
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
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  },
};

export const images = {
  provider: cloudinaryProvider,
  isConfigured: () => images.provider.isConfigured(),
  upload: (buffer) => images.provider.upload(buffer),
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
