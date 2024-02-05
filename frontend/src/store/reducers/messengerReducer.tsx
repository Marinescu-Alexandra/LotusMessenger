import {
    FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, SEND_MESSAGE_SUCCESS, SOCKET_MESSAGE, UPDATE_FRIEND_MESSAGE, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_SUCCESS_CLEAR,
    MESSAGE_SEND_SUCCESS_CLEAR, SEEN_MESSAGE, DELIVER_MESSAGE, NEW_USER_ADDED, NEW_USER_ADDED_CLEAR, UNDELIVERED_GET_SUCCESS, UNDELIVERED_GET_SUCCESS_CLEAR
} from '../types/messengerType'
import { LOGOUT_SUCCESS } from '../types/authType'
import { PayloadAction } from '@reduxjs/toolkit';
import { Friend, Message } from '@/ts/interfaces/interfaces'

interface MessengerState {
    friends: Friend[],
    messages: Message[],
    messageSendSuccess: boolean,
    newUserAdded: boolean,
    undeliveredMessages: Message[],
    imagePaths: string[]
}

const messengerState: MessengerState = {
    friends: [],
    messages: [],
    messageSendSuccess: false,
    newUserAdded: false,
    undeliveredMessages: [],
    imagePaths: []
}

export const messengerReducer = (state = messengerState, action: PayloadAction<{ friends: Friend[], newUserAdded: Friend, message: Message, paths: string[], messages: Message[], messageInfo: Message, status: string, undeliveredMessages: Message[]   }>) => {
    if (action.type === FRIEND_GET_SUCCESS) {
        return {
            ...state,
            friends: action.payload.friends
        }
    }
    if (action.type === NEW_USER_ADDED) {
        return {
            ...state,
            newUserAdded: action.payload.newUserAdded
        }
    }
    if (action.type === NEW_USER_ADDED_CLEAR) {
        return {
            ...state,
            newUserAdded: false
        }
    }
    if (action.type === SEND_MESSAGE_SUCCESS) {
        return {
            ...state,
            messageSendSuccess: true,
            messages: [...state.messages, action.payload.message],
        }
    }
    if (action.type === UPLOAD_IMAGES_SUCCESS) {
        return {
            ...state,
            imagePaths: state.imagePaths.concat(action.payload.paths)
        }
    }
    if (action.type === UPLOAD_IMAGES_SUCCESS_CLEAR) {
        return {
            ...state,
            imagePaths: []
        }
    }
    if (action.type === SOCKET_MESSAGE) {
        return {
            ...state,
            messages: [...state.messages, action.payload.message]
        }
    }
    if (action.type === MESSAGE_GET_SUCCESS) {
        return {
            ...state,
            messages: action.payload.messages
        }
    }

    if (action.type === UPDATE_FRIEND_MESSAGE) {
        const index = state.friends.findIndex(user => user._id === action.payload.messageInfo.receiverId || user._id === action.payload.messageInfo.senderId);
        const newFriends = [{

            ...state.friends[index],
            lastMessageInfo: {
                ...action.payload.messageInfo,
                status: action.payload.status
            }
        }, ...state.friends.slice(0, index), ...state.friends.slice(index + 1)]
        return {
            ...state,
            friends: newFriends
        }
    }

    if (action.type === MESSAGE_SEND_SUCCESS_CLEAR) {
        return {
            ...state,
            messageSendSuccess: false,
        }
    }

    if (action.type === SEEN_MESSAGE) {
        const index = state.friends.findIndex(user => user._id === action.payload.messageInfo.receiverId || user._id === action.payload.messageInfo.senderId);
        const newFriends = [{

            ...state.friends[index],
            lastMessageInfo: {
                ...action.payload.messageInfo,
                status: 'seen'
            }
        }, ...state.friends.slice(0, index), ...state.friends.slice(index + 1)]
        return {
            ...state,
            friends: newFriends
        }
    }

    if (action.type === DELIVER_MESSAGE) {
        const index = state.friends.findIndex(user => user._id === action.payload.messageInfo.receiverId || user._id === action.payload.messageInfo.senderId);
        const newFriends = [{

            ...state.friends[index],
            lastMessageInfo: {
                ...action.payload.messageInfo,
                status: 'delivered'
            }
        }, ...state.friends.slice(0, index), ...state.friends.slice(index + 1)]
        return {
            ...state,
            friends: newFriends
        }
    }

    if (action.type === UNDELIVERED_GET_SUCCESS) {
        return {
            ...state,
            undeliveredMessages: action.payload.undeliveredMessages
        }
    }

    if (action.type === UNDELIVERED_GET_SUCCESS_CLEAR) {
        return {
            ...state,
            undeliveredMessages: []
        }
    }

    if (action.type === LOGOUT_SUCCESS) {
        return {
            ...state,
            friends: [],
            messages: [],
            messageSendSuccess: false,
        }
    }

    return state;
}