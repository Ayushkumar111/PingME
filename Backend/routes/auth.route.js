import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/auth.controller.js';
import { CheckAuth } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',signup);


router.post('/login',login);


router.post('/logout',logout);

router.put('/update-profile', protectRoute,updateProfile);

router.get('/check' , protectRoute , CheckAuth); //call this fun when application is refreshed to check is user is authenticated or not
export default router;