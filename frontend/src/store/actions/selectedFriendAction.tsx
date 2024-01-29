import axios from 'axios'
import { GET_SELECTED_FRIEND_SUCCESS, GET_SHARED_MEDIA_SUCCESS } from '../types/selectedFriendType'

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

export const getSharedMedia = (data: any) => {
    return async (dispatch: any) => {
        dispatch({
            type: GET_SHARED_MEDIA_SUCCESS,
            payload: {
                sharedMedia: data
            }
        })
    }
}