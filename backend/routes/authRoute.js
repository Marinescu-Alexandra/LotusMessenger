const router = require('express').Router();

const { userRegister, userLogin, userLogout, updateUserProfileImage } = require('../controller/authController')
const { authMiddleware } = require('../middleware/authMiddleware');


router.post('/user-login', userLogin)
router.post('/user-register', userRegister)
router.post('/user-logout', authMiddleware, userLogout)
router.post('/update-user-profile-picture', authMiddleware, updateUserProfileImage)

module.exports = router;