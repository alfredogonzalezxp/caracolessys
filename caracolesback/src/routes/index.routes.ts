import express from 'express';
const router = express.Router();
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import authRoutes from './auth.routes';
import paymentRoutes from './payment.routes';

// Health Check Endpoint
router.get('/health', (req: any, res: any) => {
  res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/payment', paymentRoutes);

export default router;
