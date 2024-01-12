import axios from "axios"
import { FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, GET_SELECTED_FRIEND_SUCCESS, SEND_MESSAGE_SUCCESS } from '../types/messengerType'

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

export const getSelectedFriend = (data: any) => {
    return async (dispatch: any) => {
        dispatch({
            type: GET_SELECTED_FRIEND_SUCCESS,
            payload: {
                selectedFriendData: data
            }
        })
    }
}

export const messageSend = (data: any) => async (dispatch: any) => {
    console.log(data)
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

export const imageMessageSend = (data: any) => async (dispatch: any) => {
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
        const response = await axios.post('http://localhost:5000/api/messenger/image-message-send', data, newConfig);
        dispatch({
            type: SEND_MESSAGE_SUCCESS,
            payload: {
                message: response.data.message
            }
        })
    } catch(error) {
        console.log(error)
    }
}

export const seenMessage = (data: any) => async (dispatch: any) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/seen-message', data, config);
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
}

export const updateMessage = (data: any) => async (dispatch: any) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/deliver-message', data, config);
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
}