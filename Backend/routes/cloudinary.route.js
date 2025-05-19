import express from 'express';
import { generateSignature } from '../controllers/cloudinary.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/cloudinary-signature', protectRoute , generateSignature);

export default router ; 