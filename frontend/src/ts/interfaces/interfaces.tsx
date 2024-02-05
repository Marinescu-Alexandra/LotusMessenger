export interface Dictionary<T> {
    [Key: string]: T;
}

export interface LastMessage {
    message: {
        text: string,
        image: string[]
    },
    _id: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export interface Friend {
    _id: string,
    username: string,
    password: string,
    profileImage: string,
    status: string,
    theme: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
    lastMessageInfo: LastMessage
}

export interface UserInfo {
    id: string,
    username: string,
    registerTimer: string,
    profileImage: string,
    status: string,
    theme: string,
    iat: number,
    exp: number
}

export interface SocketUser {
    userId: string,
    socketId: string,
    userInfo: UserInfo
}

export interface SocketMessage {
    senderId: string,
    senderName: string,
    receiverId: string,
    createdAt: string,
    updatedAt: string,
    message: {
        text: string,
        image: string[]
    }
    __v: number,
    _id: string,
    status: string,
}


export interface SocketTypingMessage {
    senderId: string,
    receiverId: string,
    message: string
}

export interface Message {
    senderId: string,
    message: {
        text: string,
        image: string[]
    },
    createdAt: string,
    status: string
}