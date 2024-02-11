import { GET_SELECTED_FRIEND_SUCCESS, GET_SHARED_MEDIA_SUCCESS, UPDATE_SHARED_MEDIA_SUCCESS } from '../actionTypes/selectedFriendType'
import { LOGOUT_SUCCESS } from '../actionTypes/authType'
import { PayloadAction } from '@reduxjs/toolkit';
import { Friend } from '@/ts/interfaces/interfaces'

interface SelectedFriendState {
    selectedFriendData: Friend,
    sharedMedia: string[]
}

const selectedFriendState: SelectedFriendState = {
    selectedFriendData: {} as Friend,
    sharedMedia: []
}

export const selectedFriendReducer = (state = selectedFriendState, action: PayloadAction<{ selectedFriendData: Friend, sharedMedia: string[], imagePath: string }>) => {
    switch (action.type) {
        case GET_SELECTED_FRIEND_SUCCESS:
            return {
                ...state,
                selectedFriendData: action.payload.selectedFriendData
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                selectedFriendData: {} as Friend
            }
        case GET_SHARED_MEDIA_SUCCESS:
            return {
                ...state,
                sharedMedia: action.payload.sharedMedia
            }
        case UPDATE_SHARED_MEDIA_SUCCESS:
            return {
                ...state,
                sharedMedia: [...state.sharedMedia, action.payload.imagePath]
            }
        default:
            return {
                ...state,
            }
    }
}
