import {
    FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, SEND_MESSAGE_SUCCESS, SOCKET_MESSAGE, UPDATE_LAST_MESSAGE_INFO, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_SUCCESS_CLEAR, MESSAGE_GET_SUCCESS_CLEAR,
    MESSAGE_SEND_SUCCESS_CLEAR, NEW_USER_ADDED, NEW_USER_ADDED_CLEAR, UPDATE_UNDELIVERED_SUCCESS, UPDATE_UNDELIVERED_SUCCESS_CLEAR, LAST_MESSAGES_GET_SUCCESS, UPDATE_MESSAGES
} from '../types/messengerType'
import { LOGOUT_SUCCESS } from '../types/authType'
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
            return {
                ...state,
                messages: state.messages.map(
                    (message) => message.status !== action.payload.status && message.status !== 'seen' ? { ...message, status: action.payload.status } : message
                )
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
                messages: [...state.messages, action.payload.message]
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
            }
    
        default:
            return {
                ...state,
            }
    }
}