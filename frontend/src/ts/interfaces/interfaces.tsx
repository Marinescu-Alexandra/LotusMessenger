export interface Dictionary<T> {
    [Key: string]: T;
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
    lastMessageInfo: Message
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

export interface Message {
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