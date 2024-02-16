import {
    FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, SEND_MESSAGE_SUCCESS, SOCKET_MESSAGE, UPDATE_LAST_MESSAGE_INFO, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_SUCCESS_CLEAR, MESSAGE_GET_SUCCESS_CLEAR,
    MESSAGE_SEND_SUCCESS_CLEAR, NEW_USER_ADDED, NEW_USER_ADDED_CLEAR, UPDATE_UNDELIVERED_SUCCESS, UPDATE_UNDELIVERED_SUCCESS_CLEAR, LAST_MESSAGES_GET_SUCCESS, UPDATE_MESSAGES, SOCKET_GET_SUCCESS_CLEAR
} from '../actionTypes/messengerType'
import { LOGOUT_SUCCESS } from '../actionTypes/authType'
import { PayloadAction } from '@reduxjs/toolkit';
import { Friend, Message, Dictionary } from '@/ts/interfaces/interfaces'

interface MessengerState {
    friends: Friend[],
    friendsGetSuccess: boolean,
    lastMessages: Dictionary<Message>,
    lastMessagesGetSuccess: boolean,
    messages: Message[],
    messagesGetSuccess: boolean,
    messageSendSuccess: boolean,
    socketGetSuccess: boolean,
    newUserAdded: boolean,
    updateUndeliveredMessages: boolean,
    imagePaths: string[]
}

const messengerState: MessengerState = {
    friends: [],
    friendsGetSuccess: false,
    lastMessages: {},
    lastMessagesGetSuccess: false,
    messages: [],
    messagesGetSuccess: false,
    messageSendSuccess: false,
    socketGetSuccess: false,
    newUserAdded: false,
    updateUndeliveredMessages: false,
    imagePaths: []
}

export const messengerReducer = (state = messengerState, action: PayloadAction<{ friends: Friend[], lastMessages: Dictionary<Message>, id: string, newUserAdded: Friend, message: Message, paths: string[], messages: Message[], messageInfo: Message, status: string, undeliveredMessages: Message[] }>) => {
    switch (action.type) {

        case FRIEND_GET_SUCCESS:
            return {
                ...state,
                friends: action.payload.friends,
                friendsGetSuccess: true
            }
        
        case LAST_MESSAGES_GET_SUCCESS:
            return {
                ...state,
                lastMessages: action.payload.lastMessages,
                lastMessagesGetSuccess: true,
            }
        
        case NEW_USER_ADDED:
            return {
                ...state,
                newUserAdded: action.payload.newUserAdded
            }
        
        case NEW_USER_ADDED_CLEAR:
            return {
                ...state,
                newUserAdded: false
            }
        
        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                messages: [...state.messages, action.payload.message],
                messageSendSuccess: true,
            }
        
        case MESSAGE_SEND_SUCCESS_CLEAR:
            return {
                ...state,
                messageSendSuccess: false,
            }

        case UPDATE_MESSAGES:
            const updatedMessages = [...state.messages]
            for (let i = updatedMessages.length - 1; i >= 0; i--) {
                if (updatedMessages[i].status === action.payload.status || updatedMessages[i].status === 'seen') {
                    break
                }
                updatedMessages[i] = {
                    ...updatedMessages[i],
                    status: action.payload.status
                }
            }
            return {
                ...state,
                messages: updatedMessages
            }
    
        case UPLOAD_IMAGES_SUCCESS:
            return {
                ...state,
                imagePaths: state.imagePaths.concat(action.payload.paths)
            }
    
        case UPLOAD_IMAGES_SUCCESS_CLEAR:
            return {
                ...state,
                imagePaths: []
            }
    
        case SOCKET_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload.message],
                socketGetSuccess: true
            }
        
        case SOCKET_GET_SUCCESS_CLEAR: {
            return {
                ...state,
                socketGetSuccess: false
            }
        }
    
        case MESSAGE_GET_SUCCESS:
            return {
                ...state,
                messages: action.payload.messages,
                messagesGetSuccess: true,
            }
    
        case MESSAGE_GET_SUCCESS_CLEAR:
            return {
                ...state,
                messagesGetSuccess: false,
            }
    
        case UPDATE_LAST_MESSAGE_INFO:
            return {
                ...state,
                lastMessages: {
                    ...state.lastMessages,
                    [action.payload.id]: action.payload.messageInfo
                }
            }
    
        case UPDATE_UNDELIVERED_SUCCESS:
            return {
                ...state,
                updateUndeliveredMessages: true
            }
    
        case UPDATE_UNDELIVERED_SUCCESS_CLEAR:
            return {
                ...state,
                updateUndeliveredMessages: false
            }
    
        case LOGOUT_SUCCESS:
            return {
                ...state,
                friends: [],
                messages: [],
                messageSendSuccess: false,
                lastMessages: {},
                lastMessagesGetSuccess: false,
            }
    
        default:
            return {
                ...state,
            }
    }
}