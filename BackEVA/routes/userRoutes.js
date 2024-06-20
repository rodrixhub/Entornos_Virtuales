import express from 'express';
import {
  registerUserController,
  getUserByEmailController,
  updateUserController,
  getUserByIdController,
  loginController
} from '../controllers/userController.js';

const router = express.Router();

// Routes
router.post('/register-user', registerUserController);
router.post('/login-user', loginController);
router.get('/get-user/:email', getUserByEmailController);
router.get('/get-user-id/:id', getUserByIdController);
router.put('/update-user/:id', updateUserController);

export default router;
