import { GET_SELECTED_FRIEND_SUCCESS, GET_SHARED_MEDIA_SUCCESS } from '../types/selectedFriendType'
import { LOGOUT_SUCCESS } from '../types/authType'

interface Dictionary<T> {
    [Key: string]: T;
}

interface SelectedFriendState {
    selectedFriendData: Dictionary<string>,
    sharedMedia: string[]
}

const selectedFriendState: SelectedFriendState = {
    selectedFriendData: {},
    sharedMedia: []
}

export const selectedFriendReducer = (state = selectedFriendState, action: any) => {
    switch (action.type) {
        case GET_SELECTED_FRIEND_SUCCESS:
            return {
                ...state,
                selectedFriendData: action.payload.selectedFriendData
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                selectedFriendData: {}
            }
        case GET_SHARED_MEDIA_SUCCESS:
            return {
                ...state,
                sharedMedia: action.payload.sharedMedia
            }
        default:
            return {
                ...state,
            }
    }
}
