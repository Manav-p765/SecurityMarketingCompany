import { Router } from 'express';
import multer from 'multer';
import { detectImageType, images, MAX_BYTES } from '../../services/images.js';

/**
 * POST /api/admin/uploads (multipart, field "image"): jpg, png or webp up to
 * 5 MB, checked by content rather than file name, then stored on
 * Cloudinary (resized there to at most 1600px wide).
 */
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_BYTES, files: 1 } });

router.post('/', (req, res) => {
  if (!images.isConfigured()) {
    return res.status(503).json({ message: 'Image uploads are not set up yet (Cloudinary settings missing on the server).' });
  }
  return upload.single('image')(req, res, async (err) => {
    if (err?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Images must be 5 MB or smaller.' });
    if (err) return res.status(400).json({ message: 'Could not read that file.' });
    if (!req.file) return res.status(400).json({ message: 'Choose an image to upload.' });
    if (!detectImageType(req.file.buffer)) {
      return res.status(400).json({ message: 'Use a JPG, PNG or WebP image.' });
    }
    try {
      const image = await images.upload(req.file.buffer);
      return res.status(201).json({ image });
    } catch (uploadError) {
      console.error('[uploads] failed:', uploadError.message);
      return res.status(502).json({ message: 'The image could not be uploaded. Please try again.' });
    }
  });
});

export default router;
