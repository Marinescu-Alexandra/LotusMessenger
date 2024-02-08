import express from 'express';
var router = express.Router();

import { getFriends, messageUploadDB, getMessages, imagesUpload, messageSeen, messageDeliver, updateUndeliveredMessages, getLastMessages, updateUnseenMessages } from '../controller/messengerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { errorHandler } from '../errors/errorHandler.js';

router.get('/get-last-messages', authMiddleware, getLastMessages, errorHandler)
router.get('/get-friends', authMiddleware, getFriends, errorHandler)
router.post('/send-message', authMiddleware, messageUploadDB, errorHandler)
router.get('/get-messages/:id', authMiddleware, getMessages, errorHandler)
router.post('/images-upload', authMiddleware, imagesUpload, errorHandler)
router.post('/seen-message', authMiddleware, messageSeen, errorHandler)
router.post('/deliver-message', authMiddleware, messageDeliver, errorHandler)
router.get('/update-undelivered-messages/:id', authMiddleware, updateUndeliveredMessages, errorHandler)
router.get('/update-unseen-messages/:id', authMiddleware, updateUnseenMessages, errorHandler)

export default router;