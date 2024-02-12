import { join } from 'path'
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../models/authModel.js';
import { MessageModel } from '../models/messageModel.js'
import formidable from 'formidable';
import { copyFile } from 'fs/promises'
import { verifyFilename } from '../utils/verifyFilename.js'
import { ForbiddenError } from '../errors/errors.js'

export async function getLastMessages(req, res, next) {
    const myId = req.myId

    try {
        const lastMessages = await MessageModel.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: myId },
                        { receiverId: myId }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    "_id": {
                        $cond: [
                            { $eq: ["$senderId", myId] },
                            { $concat: ["$senderId", "-", "$receiverId"] },
                            { $concat: ["$receiverId", "-", "$senderId"] }
                        ]
                    },
                    "lastMessage": { $first: "$$ROOT" }
                }
            }
        ]);

        const lastMessagesMap = {};

        for (const foundMessage of lastMessages) {
            const message = foundMessage.lastMessage
            const key = message.senderId !== myId ? message.senderId : message.receiverId;
            lastMessagesMap[key] = message;
        }

        res.status(200).json({
            lastMessages: lastMessagesMap
        })

    } catch(error) {
        next(error)
    }
}

export async function getFriends(req, res, next) {
    const myId = req.myId

    try {
        const friendGet = await User.find({
            _id: {
                $ne: myId
            }
        })

        const friendList = friendGet.map((friend) => ({
            ...friend._doc,
        }))

        res.status(200).json({
            success: true,
            friends: friendList
        })

    } catch (error) {
        next(error)
    }
}

export async function messageUploadDB(req, res, next) {
    const {
        senderId,
        receiverId,
        message,
        senderName,
        images
    } = req.body

    try {
        const insertMessage = await MessageModel.create({
            senderId: senderId,
            receiverId: receiverId,
            message: {
                text: message,
                image: images
            },
            senderName: senderName
        })
        res.status(201).json({
            success: true,
            message: insertMessage
        })
    } catch (error) {
        next(error)
    }
}

export async function getMessages(req, res, next) {
    const currentUserId = req.myId;
    const friendId = req.params.id

    try {
        let getAllMessages = await MessageModel.find({

            $or: [{
                $and: [{
                    senderId: {
                        $eq: currentUserId
                    }
                }, {
                    receiverId: {
                        $eq: friendId
                    }
                }]
            }, {
                $and: [{
                    senderId: {
                        $eq: friendId
                    }
                }, {
                    receiverId: {
                        $eq: currentUserId
                    }
                }]
            }]

        })
        res.status(200).json({
            success: true,
            messages: getAllMessages
        })
    } catch (error) {
        next(error)
    }
}

export async function updateUndeliveredMessages(req, res, next) {
    const currentUserId = req.myId;
    const friendId = req.params.id

    try {
        await MessageModel.updateMany(
            {
                $and: [{
                    senderId: {
                        $eq: friendId
                    }
                }, {
                    receiverId: {
                        $eq: currentUserId
                    }
                }, {
                    status: {
                        $eq: 'undelivered'
                    }
                }]
            }, 
            {
                status: 'delivered'
            }
        )
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        next(error)
    }
}

export async function updateUnseenMessages(req, res, next) {
    const currentUserId = req.myId;
    const friendId = req.params.id

    try {
        await MessageModel.updateMany(
            {
                $and: [{
                    senderId: {
                        $eq: friendId
                    }
                }, {
                    receiverId: {
                        $eq: currentUserId
                    }
                }, {
                    status: {
                        $eq: 'delivered'
                    }
                }]
            },
            {
                status: 'seen'
            }
        )
        res.status(200).json({
            success: true,
        })
    } catch (error) {
        next(error)
    }
}

export async function imagesUpload(req, res, next) {
    var form = formidable({})
    try {
        const [fields, files] = await form.parse(req)

        const imageNames = fields['imageName[]']

        const paths = []
        imageNames.forEach(async function callback(name, index) {

            const verify = verifyFilename(name, path.resolve('frontend/public/userImages/'))
            if (!verify) {
                throw new ForbiddenError("Ilegall file name")
            }

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const newPath = join(__dirname + `../../../frontend/public/userImages/${name}`)
            files['fileToUpload[]'][index].originalFilename = name
            paths.push(name)
            await copyFile(files['fileToUpload[]'][index].filepath, newPath)
        })
        res.status(200).json({
            success: true,
            paths: paths
        })
        
    } catch (error) {
        next(error)
    }
}

export async function messageSeen(req, res, next) {
    const messageId = req.body._id

    try {
        await MessageModel.findByIdAndUpdate(messageId, {
            status: 'seen'
        })
        const message = await MessageModel.findById(messageId)
        res.status(200).json({
            message: message,
            success: true
        })
    } catch(error) {
        next(error)
    }
}

export async function messageDeliver(req, res, next) {
    const messageId = req.body._id

    try {
        await MessageModel.findByIdAndUpdate(messageId, {
            status: 'delivered'
        })
        const message = await MessageModel.findById(messageId)
        res.status(200).json({
            message: message,
            success: true
        })
    } catch (error) {
        next(error)
    }
}