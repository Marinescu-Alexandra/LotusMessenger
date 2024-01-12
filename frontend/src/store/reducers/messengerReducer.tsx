import {
    FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, SEND_MESSAGE_SUCCESS, SOCKET_MESSAGE, UPDATE_FRIEND_MESSAGE, MESSAGE_SEND_SUCCESS_CLEAR, SEEN_MESSAGE, DELIVER_MESSAGE
} from '../types/messengerType'

interface Dictionary<T> {
    [Key: string]: T;
}

interface MessengerState {
    friends: Dictionary<string>[],
    messages: Dictionary<string>[],
    messageSendSuccess: boolean,
}

const messengerState: MessengerState = {
    friends: [],
    messages: [],
    messageSendSuccess: false,
}

export const messengerReducer = (state = messengerState, action: any) => {
    if (action.type == FRIEND_GET_SUCCESS) {
        return {
            ...state,
            friends: action.payload.friends
        }
    }
    if (action.type === SEND_MESSAGE_SUCCESS) {
        return {
            ...state,
            messageSendSuccess: true,
            messages: [...state.messages, action.payload.message],
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
                state: action.payload.status
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


    return state;
}