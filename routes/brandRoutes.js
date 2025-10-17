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

// ------------------------- CREATE BRAND + VEHICLES + HANDEL MULTIPLE IMAGE -------------------------
router.post('/create', upload.any(), createBrand);

// ------------------------- GET ALL Brands -------------------------
router.get('/', getAllBrands);
// ------------------------- UPDATE  BRAND + VEHICLES  -------------------------
router.patch('/:brandId', upload.any(), updateBrand);

// ------------------------- HARD DELETE  BRAND + VEHICLES  -------------------------
router.delete('/:brandId', deleteBrand);

// ------------------------- SOFT DELETE  BRAND + VEHICLES  -------------------------
router.patch('/soft/:brandId', softDeleteBrand);

export default router;
