const router = require('express').Router();

const { userRegister, userLogin, userLogout, updateUserProfileImage, updateUserTheme, updateUserName, updateUserStatus } = require('../controller/authController')
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/user-login', userLogin)
router.post('/user-register', userRegister)
router.post('/user-logout', authMiddleware, userLogout)
router.post('/update-user-profile-picture', authMiddleware, updateUserProfileImage)
router.post('/update-user-theme', authMiddleware, updateUserTheme)
router.post('/update-user-name', authMiddleware, updateUserName)
router.post('/update-user-status', authMiddleware, updateUserStatus)

module.exports = router;