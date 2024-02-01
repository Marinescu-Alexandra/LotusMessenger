import axios from "axios"
import {  FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, SEND_MESSAGE_SUCCESS, UNDELIVERED_GET_SUCCESS, UPLOAD_IMAGES_SUCCESS } from '../types/messengerType'

const config = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    
}

export const getFriends = () => async (dispatch: any) => {
    try {
        const response = await axios.get('http://localhost:5000/api/messenger/get-friends', config);
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

export const messageSend = (data: any) => async (dispatch: any) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/send-message', data, config);
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
    return async (dispatch: any) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/messenger/get-message/${id}`, config);
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

export const uploadImages = (data: any) => async (dispatch: any) => {
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
        const response = await axios.post('http://localhost:5000/api/messenger/images-upload', data, newConfig);
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

export const seenMessage = (data: any) => async (dispatch: any) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/seen-message', data, config);
    } catch (error) {
        console.log(error)
    }
}

export const updateMessage = (data: any) => async (dispatch: any) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/deliver-message', data, config);
    } catch (error) {
        console.log(error)
    }
}

export const deliverUnsentMessages = (id: string) => async (dispatch: any) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/messenger/get-undelivered-messages/${id}`, config);
        dispatch({
            type: UNDELIVERED_GET_SUCCESS,
            payload: {
                undeliveredMessages: response.data.undeliveredMessages
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const getUnseenMessages = (id: string) => async (dispatch: any) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/messenger/get-undelivered-messages/${id}`, config);
        dispatch({
            type: UNDELIVERED_GET_SUCCESS,
            payload: {
                undeliveredMessages: response.data.undeliveredMessages
            }
        })
    } catch (error) {
        console.log(error)
    }
}