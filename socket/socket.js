import { Server } from "socket.io";

const io = new Server(8000, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 4 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    }
})

let users = [];

const addUser = (userId, socketId, userInfo) => {
    const checkUser = users.some(user => user.userId === userId);

    if (!checkUser) {
        users.push({userId, socketId, userInfo})
    }
}

const userRemove = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const findFriend = (id) => {
    return users.find(user => user.userId === id);
}

const userLogout = (userId) => {
    users = users.filter( user => user.userId !== userId)
}

io.on('connection', (socket) => {
    socket.on('addUser', (userId, userInfo) => {
        addUser(userId, socket.id, userInfo)
        io.emit('getUser', users)

        for (var i = 0; i < users.length; i++){
            if (users[i].userId !== userId) {
                socket.to(users[i].socketId).emit('newUserAdded', true)
            }
        }
    })
    
    socket.on('userProfileInfoUpdate', (userId) => {
        for (var i = 0; i < users.length; i++) {
            if (users[i].userId !== userId) {
                socket.to(users[i].socketId).emit('updateFriendList', userId)
            }
        }
    })

    socket.on('checkIfActiveInstance', (userData) => {
        for (var i = 0; i < users.length; i++) {
            if (users[i].userId === userData.id) {
                socket.to(users[i].socketId).emit('removeOtherActiveInstance', userData.id)
                break
            }
        }
    })

    socket.on('removeSocketInstance', (userId) => {
        console.log('removeSocketInstance', userId)
        for (var i = 0; i < users.length; i++) {
            if (users[i].userId === userId) {
                userRemove(users[i].socketId);
                break
            }
        }        
    })

    socket.on('typingMessage', (data) => {
        const user = findFriend(data.receiverId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('typingMessageGet', {
                senderId: data.senderId,
                receiverId: data.receiverId,
                message: data.message
            })
        }
    })

    socket.on('sendMessage', (data) => {
        const user = findFriend(data.receiverId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('getMessage', data)
        }
    })

    socket.on('deliverMessage', (data) => {
        const user = findFriend(data.senderId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('socketMessageDelivered', data)
        }
    })

    socket.on('messageSeen', (data) => {
        const user = findFriend(data.senderId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('socketMessageSeen', data)
        }
    })

    socket.on('deliverMessages', (data) => {
        const user = findFriend(data.senderId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('updateLastMessageAsDelivered', data)
        }
    })

    socket.on('seenMessages', (data) => {
        const user = findFriend(data.senderId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('updateLastMessageAsSeen', data)
        }
    })

    socket.on('logout', (userId) => {
        userLogout(userId)
        io.emit('getUser', users)
    })

    socket.on('disconnect', (reason) => {
        console.log(reason);
        userRemove(socket.id);
        io.emit('getUser', users);
    })
})