const router = require('express').Router();

const { getFriends, messageUploadDB, messageGet, imageMessageSend, messageSeen } = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/get-friends', authMiddleware, getFriends)
router.post('/send-message', authMiddleware, messageUploadDB)
router.get('/get-message/:id', authMiddleware, messageGet)
router.post('/image-message-send', authMiddleware, imageMessageSend)
router.post('/seen-message', authMiddleware, messageSeen)

module.exports = router;