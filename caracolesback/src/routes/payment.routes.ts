import express from 'express';
const router = express.Router();
import * as paymentController from '../controllers/payment.controller';

// SnailPay simulation endpoint
router.post('/deposit', paymentController.simulateDeposit);
// Payment history endpoint
router.get('/history/:userId', paymentController.getPaymentHistory);
// Delete payment endpoint
router.delete('/:id', paymentController.deletePayment);

export default router;
