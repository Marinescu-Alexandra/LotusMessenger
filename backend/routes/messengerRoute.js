const router = require('express').Router();

const { getFriends, messageUploadDB, messageGet, imagesUpload, messageSeen, messageDeliver, undeliveredMessagesGet, updateUserProfileImage } = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/get-friends', authMiddleware, getFriends)
router.post('/send-message', authMiddleware, messageUploadDB)
router.get('/get-message/:id', authMiddleware, messageGet)
router.post('/images-upload', authMiddleware, imagesUpload)
router.post('/seen-message', authMiddleware, messageSeen)
router.post('/deliver-message', authMiddleware, messageDeliver)
router.get('/get-undelivered-messages/:id', authMiddleware, undeliveredMessagesGet)
router.post('/update-user-profile-picture', authMiddleware, updateUserProfileImage)

module.exports = router;