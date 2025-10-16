import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createBrand, getAllBrands, updateBrand, deleteBrand, softDeleteBrand } from '../controllers/brandController.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
router.post(
  '/create',
  upload.fields([
    { name: 'brandImage', maxCount: 1 },
    { name: 'vehicleImage_0', maxCount: 1 },
    { name: 'vehicleImage_1', maxCount: 1 },
    { name: 'vehicleImage_2', maxCount: 1 },
    { name: 'vehicleImage_3', maxCount: 1 }
  ]),
  createBrand
);

router.get('/', getAllBrands);

router.patch(
  '/:brandId',
  upload.fields([
    { name: 'brandImage', maxCount: 1 },
    { name: 'vehicleImage_0', maxCount: 1 },
    { name: 'vehicleImage_1', maxCount: 1 },
    { name: 'vehicleImage_2', maxCount: 1 },
    { name: 'vehicleImage_3', maxCount: 1 }
  ]),
  updateBrand
);

router.delete('/:brandId', deleteBrand);
router.patch('/soft/:brandId', softDeleteBrand);

export default router;
