import express from 'express';
var router = express.Router();

import { userRegister, userLogin, userLogout, updateUserProfileImage, updateUserTheme, updateUserName, updateUserStatus } from '../controller/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { errorHandler } from '../errors/errorHandler.js';

router.post('/user-login', userLogin, errorHandler)
router.post('/user-register', userRegister, errorHandler)
router.post('/user-logout', authMiddleware, userLogout)
router.post('/update-user-profile-picture', authMiddleware, updateUserProfileImage, errorHandler)
router.post('/update-user-theme', authMiddleware, updateUserTheme, errorHandler)
router.post('/update-user-name', authMiddleware, updateUserName, errorHandler)
router.post('/update-user-status', authMiddleware, updateUserStatus, errorHandler)

export default router;