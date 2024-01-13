import { GET_SELECTED_FRIEND_SUCCESS } from '../types/messengerType'
import { LOGOUT_SUCCESS } from '../types/authType'

interface Dictionary<T> {
    [Key: string]: T;
}

interface SelectedFriendState {
    selectedFriendData: Dictionary<string>
}

const selectedFriendState: SelectedFriendState = {
    selectedFriendData: {}
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
        default:
            return {
                ...state,
            }
    }
}
