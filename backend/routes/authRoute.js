const router = require('express').Router();

const { userRegister, userLogin, userLogout, updateUserProfileImage, updateUserTheme, updateUserName, updateUserStatus } = require('../controller/authController')
const { authMiddleware } = require('../middleware/authMiddleware');
const { errorHandler } = require('../errors/errorHandler');

router.post('/user-login', userLogin, errorHandler)
router.post('/user-register', userRegister, errorHandler)
router.post('/user-logout', authMiddleware, userLogout)
router.post('/update-user-profile-picture', authMiddleware, updateUserProfileImage, errorHandler)
router.post('/update-user-theme', authMiddleware, updateUserTheme, errorHandler)
router.post('/update-user-name', authMiddleware, updateUserName, errorHandler)
router.post('/update-user-status', authMiddleware, updateUserStatus, errorHandler)

module.exports = router;