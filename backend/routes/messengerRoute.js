import express from 'express';
var router = express.Router();

import { getFriends, messageUploadDB, messageGet, imagesUpload, messageSeen, messageDeliver, undeliveredMessagesGet } from '../controller/messengerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { errorHandler } from '../errors/errorHandler.js';

router.get('/get-friends', authMiddleware, getFriends, errorHandler)
router.post('/send-message', authMiddleware, messageUploadDB, errorHandler)
router.get('/get-message/:id', authMiddleware, messageGet, errorHandler)
router.post('/images-upload', authMiddleware, imagesUpload, errorHandler)
router.post('/seen-message', authMiddleware, messageSeen, errorHandler)
router.post('/deliver-message', authMiddleware, messageDeliver, errorHandler)
router.get('/get-undelivered-messages/:id', authMiddleware, undeliveredMessagesGet, errorHandler)

export default router;