import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller';

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
