const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
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
        console.log('User added... with socket id', socket.id)
        addUser(userId, socket.id, userInfo)
        io.emit('getUser', users)

        const filteredUsers = users.filter(user => user.userId !== userId)
        for (var i = 0; i < filteredUsers.length; i++){
            socket.to(filteredUsers[i].socketId).emit('newUserAdded', true)
        }
    })

    socket.on('checkIfActiveInstance', (userData) => {
        console.log(userData)
        console.log(users)
        otherInstance = users.find(user => user.userId === userData.id)
        if (otherInstance) {
            socket.to(otherInstance.socketId).emit('removeOtherActiveInstance', userData.id)
        }
    })

    socket.on('sendMessage', (data) => {
        const user = findFriend(data.receiverId)
        console.log(data)
        if (user !== undefined) {
            socket.to(user.socketId).emit('getMessage', data)
        }
    })

    socket.on('messageSeen', (data) => {
        const user = findFriend(data.senderId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('messageSeenResponse', data)
        }
    })

    socket.on('deliverMessage', (data) => {
        const user = findFriend(data.senderId)
        if (user !== undefined) {
            socket.to(user.socketId).emit('messageDeliverResponse', data)
        }
    })

    socket.on('logout', (userId) => {
        userLogout(userId)
        io.emit('getUser', users)
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

    socket.on('disconnect', () => {
        console.log('User is removed... with socket id', socket.id)
        userRemove(socket.id);
        io.emit('getUser', users);
    })
})