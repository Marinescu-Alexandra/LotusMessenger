const router = require('express').Router();

const { getFriends, messageUploadDB, messageGet, imageMessageSend, messageSeen, messageDeliver, undeliveredMessagesGet } = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/get-friends', authMiddleware, getFriends)
router.post('/send-message', authMiddleware, messageUploadDB)
router.get('/get-message/:id', authMiddleware, messageGet)
router.post('/image-message-send', authMiddleware, imageMessageSend)
router.post('/seen-message', authMiddleware, messageSeen)
router.post('/deliver-message', authMiddleware, messageDeliver)
router.get('/get-undelivered-messages/:id', authMiddleware, undeliveredMessagesGet)

module.exports = router;