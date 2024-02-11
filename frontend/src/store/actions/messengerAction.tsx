import api from "@/axiosConfig"
import { useAppDispatch } from "../hooks"
import { FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, SEND_MESSAGE_SUCCESS, UPDATE_UNDELIVERED_SUCCESS, UPDATE_UNSEEN_SUCCESS, UPLOAD_IMAGES_SUCCESS, LAST_MESSAGES_GET_SUCCESS } from '../actionTypes/messengerType'

const config = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    
}

interface MessageData {
    senderName: string,
    senderId: string,
    receiverId: string,
    message: string,
    images: string[]
}

export const getFriends = () => async (dispatch = useAppDispatch()) => {
    try {
        const response = await api.get('/api/messenger/get-friends', config);
        dispatch({
            type: FRIEND_GET_SUCCESS,
            payload: {
                friends: response.data.friends
            }
        })
    } catch(error){
        console.log(error)
    }
}

export const getLastMessages = () => async (dispatch = useAppDispatch()) => {
    try {
        const response = await api.get('/api/messenger/get-last-messages', config);
        dispatch({
            type: LAST_MESSAGES_GET_SUCCESS,
            payload: {
                lastMessages: response.data.lastMessages
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const messageSend = (data: MessageData) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await api.post('/api/messenger/send-message', data, config);
        dispatch({
            type: SEND_MESSAGE_SUCCESS,
            payload: {
                message: response.data.message
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const getMessages = (id: string) => {
    return async (dispatch = useAppDispatch()) => {
        try {
            const response = await api.get(`/api/messenger/get-messages/${id}`, config);
            dispatch({
                type: MESSAGE_GET_SUCCESS,
                payload: {
                    messages: response.data.messages
                }
            })
        } catch(error) {
            console.log(error)
        }
    }
}

export const uploadImages = (data: FormData) => async (dispatch = useAppDispatch()) => {
    const newConfig = {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        },
        api: {
            bodyParser: false,
        },
    }
    try {
        const response = await api.post('/api/messenger/images-upload', data, newConfig);
        dispatch({
            type: UPLOAD_IMAGES_SUCCESS,
            payload: {
                paths: response.data.paths
            }
        })
    } catch(error) {
        console.log(error)
    }
}

export const seenMessage = (_id: string) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await api.post('/api/messenger/seen-message', { _id }, config);
        dispatch({
            type: 'UPDATE_LAST_MESSAGE_INFO',
            payload: {
                messageInfo: response.data.message,
                id: response.data.message.senderId
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deliverMessage = (_id: string) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await api.post('/api/messenger/deliver-message', { _id }, config);
        dispatch({
            type: 'UPDATE_LAST_MESSAGE_INFO',
            payload: {
                messageInfo: response.data.message,
                id: response.data.message.senderId
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const deliverUnsentMessages = (id: string) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await api.get(`/api/messenger/update-undelivered-messages/${id}`, config);
        dispatch({
            type: UPDATE_UNDELIVERED_SUCCESS,
            payload: {
                success: response.data.success
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const markUnseenMessagesAsRead = (id: string) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await api.get(`/api/messenger/update-unseen-messages/${id}`, config);
        dispatch({
            type: UPDATE_UNSEEN_SUCCESS,
            payload: {
                success: response.data.success
            }
        })
    } catch (error) {
        console.log(error)
    }
}