import { Router } from 'express';
import multer from 'multer';
import { describeImageError, detectImageType, images, MAX_BYTES } from '../../services/images.js';

/**
 * POST /api/admin/uploads (multipart, field "image"): jpg, png or webp up to
 * 5 MB, checked by content rather than file name, then stored on
 * Cloudinary (resized there to at most 1600px wide). Every failure answers
 * with a message the editor can act on and is logged in full.
 */
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES, files: 1 } });
const MB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

router.post('/', (req, res) => {
  if (!images.isConfigured()) {
    console.error('[uploads] Cloudinary is not configured (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET missing)');
    return res.status(503).json({ message: 'Image uploads are not configured yet. Ask an admin to add the Cloudinary settings.' });
  }
  return upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error(`[uploads] could not read the upload (${err.code || 'error'}):`, err.message);
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'Image is larger than 5 MB. Use a smaller image.' });
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Upload one image at a time.' });
      }
      return res.status(400).json({ message: `The file could not be read (${err.message}). Please try again.` });
    }
    if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
    if (!detectImageType(req.file.buffer)) {
      console.warn(`[uploads] rejected "${req.file.originalname}" (${req.file.mimetype}): not a jpg, png or webp`);
      return res.status(415).json({ message: 'Only JPG, PNG or WebP images are allowed.' });
    }
    try {
      const image = await images.upload(req.file.buffer);
      return res.status(201).json({ image });
    } catch (uploadError) {
      const problem = describeImageError(uploadError);
      console.error(
        `[uploads] Cloudinary upload failed for "${req.file.originalname}" (${MB(req.file.size)}):`,
        problem.detail,
        uploadError
      );
      return res.status(problem.config ? 503 : 502).json({ message: problem.message });
    }
  });
});

export default router;
