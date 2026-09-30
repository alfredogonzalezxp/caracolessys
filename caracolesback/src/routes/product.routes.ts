import express from 'express';
const router = express.Router();
import * as productController from '../controllers/product.controller';

router.get('/', productController.getProducts);

export default router;
