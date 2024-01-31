const router = require('express').Router();

const { getFriends, messageUploadDB, messageGet, imagesUpload, messageSeen, messageDeliver, undeliveredMessagesGet } = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { errorHandler } = require('../errors/errorHandler');

router.get('/get-friends', authMiddleware, getFriends, errorHandler)
router.post('/send-message', authMiddleware, messageUploadDB, errorHandler)
router.get('/get-message/:id', authMiddleware, messageGet, errorHandler)
router.post('/images-upload', authMiddleware, imagesUpload, errorHandler)
router.post('/seen-message', authMiddleware, messageSeen, errorHandler)
router.post('/deliver-message', authMiddleware, messageDeliver, errorHandler)
router.get('/get-undelivered-messages/:id', authMiddleware, undeliveredMessagesGet, errorHandler)

module.exports = router;