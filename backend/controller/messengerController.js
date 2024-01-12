const path = require('path')
const User = require('../models/authModel')
const messageModel = require('../models/messageModel')
const formidable = require('formidable')
const fs = require('fs')

const getLastMessage = async (myId, friendId) => {
    const message = await messageModel.findOne({
        $or: [{
            $and: [{
                senderId: {
                    $eq: myId
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
                    $eq: myId
                }
            }]
        }]
    }).sort({
        updatedAt: -1
    });

    return message;
}

module.exports.getFriends = async (req, res) => {
    const myId = req.myId
    const newUsers = []

    try {
        const friendGet = await User.find({
            _id: {
                $ne: myId
            }
        })
        for (let i = 0; i < friendGet.length; i++){
            let lastMessage = await getLastMessage(myId, friendGet[i].id)
            if (lastMessage !== null) {
                const newUser = {
                    _id: friendGet[i]._id,
                    username: friendGet[i].username,
                    password: friendGet[i].password,
                    createdAt: friendGet[i].createdAt,
                    updatedAt: friendGet[i].updatedAt,
                    __v: friendGet[i].__v,
                    lastMessageInfo: {
                        message: {
                            text: lastMessage.message.text,
                            image: lastMessage.message.image
                        },
                        _id: lastMessage.id,
                        senderId: lastMessage.senderId,
                        receiverId: lastMessage.receiverId,
                        status: lastMessage.status,
                        createdAt: lastMessage.createdAt,
                        updatedAt: lastMessage.updatedAt,
                        __v: lastMessage.__v
                    }
                }
                newUsers.push(newUser)
            } else {
                const newUser = {
                    "_id": friendGet[i]._id,
                    "username": friendGet[i].username,
                    "password": friendGet[i].password,
                    "createdAt": friendGet[i].createdAt,
                    "updatedAt": friendGet[i].updatedAt,
                    "__v": friendGet[i].__v,
                    "lastMessageInfo": null
                }
                newUsers.push(newUser)
            }
            //console.log(friendGet[i].messageInfo)
        }
        console.log(friendGet)
        //const filter = friendGet.filter(e => e.id != myId)
        res.status(200).json({ success: true, friends: newUsers })
    } catch {
        res.status(500).json({
            error: {
                errorMessage: 'Internal server error'
            }
        })
    }
}

module.exports.messageUploadDB = async (req, res) => {
    const {
        senderId,
        receiverId,
        message,
        senderName
    } = req.body

    try {
        const insertMessage = await messageModel.create({
            senderId: senderId,
            receiverId: receiverId,
            message: {
                text: message,
                image: []
            },
            senderName: senderName
        })
        res.status(201).json({
            success: true,
            message: insertMessage
        })
    } catch(error) {
        res.status(500).json({
            error: {
                errorMessage: [
                    'Internal server error'
                ]
            }
        })
    }
}

module.exports.messageGet = async(req, res) => {
    const currentUserId = req.myId;
    const friendId = req.params.id

    try {
        let getAllMessages = await messageModel.find({

            $or : [{
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
        getAllMessages = getAllMessages.filter(e => e.senderId === currentUserId && e.receiverId === friendId || e.receiverId === currentUserId && e.senderId === friendId)
        res.status(200).json({
            success: true,
            messages: getAllMessages
        })
    } catch {
        res.status(500).json({
            error: {
                errorMessage: ['Internal server error']
            }
        })
    }
}

module.exports.imageMessageSend = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        const senderId = fields['senderId']
        const receiverId = fields['receiverId']
        const imageNames = fields['imageName[]']

        const paths = []
        imageNames.forEach(function callback(name, index) {
            const newPath = path.join(__dirname + `../../../frontend/public/userImages/${name}`)
            files['fileToUpload[]'][index].originalFilename = name
            paths.push(name)
            fs.copyFile(files['fileToUpload[]'][index].filepath, newPath, (err) => {
                if (err) {
                    res.status(500).json({
                        error: {
                            errorMessage: 'Image upload fail.'
                        }
                    })
                    return
                }
            })
        })
        try {
            const insertMessage = await messageModel.create({
                senderId: senderId[0],
                receiverId: receiverId[0],
                message: {
                    text: '',
                    image: paths
                }
            })
            res.status(201).json({
                success: true,
                message: insertMessage
            })
            
        } catch (error) {
            res.status(500).json({
                error: {
                    errorMessage: error
                }
            })
        }
        
    });
}

module.exports.messageSeen = async (req, res) => {
    const messageId = req.body._id
    
    await messageModel.findByIdAndUpdate(messageId, {
        status: 'seen'
    })
        .then(() => {
            res.status(200).json({
                success: true
        })
        }).catch(() => {
            res.status(500).json({
                error: {
                errorMessage: 'Internal server error'
            }
        })
    })
}