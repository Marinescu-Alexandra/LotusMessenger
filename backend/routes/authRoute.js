const router = require('express').Router();

const { userRegister, userLogin, userLogout, updateUserProfileImage, updateUserTheme } = require('../controller/authController')
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/user-login', userLogin)
router.post('/user-register', userRegister)
router.post('/user-logout', authMiddleware, userLogout)
router.post('/update-user-profile-picture', authMiddleware, updateUserProfileImage)
router.post('/update-user-theme', authMiddleware, updateUserTheme)

module.exports = router;