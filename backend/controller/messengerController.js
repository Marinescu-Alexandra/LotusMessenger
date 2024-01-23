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
            var newUser = friendGet[i]
            if (lastMessage !== null) {
                newUser = {
                    ...newUser._doc,
                    lastMessageInfo: lastMessage
                }
            } else {
                newUser = {
                    ...newUser._doc,
                    lastMessageInfo: null
                }
            }
            newUsers.push(newUser)
        }
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
        senderName,
        images
    } = req.body

    try {
        const insertMessage = await messageModel.create({
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
        //getAllMessages = getAllMessages.filter(e => e.senderId === currentUserId && e.receiverId === friendId || e.receiverId === currentUserId && e.senderId === friendId)
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

module.exports.undeliveredMessagesGet = async (req, res) => {
    const currentUserId = req.myId;
    const friendId = req.params.id

    try {
        let getAllUndeliveredMessages = await messageModel.find({
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
                    $eq: 'unseen'
                }
            }]
        })
        res.status(200).json({
            success: true,
            undeliveredMessages: getAllUndeliveredMessages
        })
    } catch {
        res.status(500).json({
            error: {
                errorMessage: ['Internal server error']
            }
        })
    }
    
}

module.exports.imagesUpload = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
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
            res.status(200).json({
                success: true,
                paths: paths
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

module.exports.messageDeliver = async (req, res) => {
    const messageId = req.body._id

    await messageModel.findByIdAndUpdate(messageId, {
        status: 'delivered'
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