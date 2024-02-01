import axios from 'axios'
import { GET_SELECTED_FRIEND_SUCCESS, GET_SHARED_MEDIA_SUCCESS, UPDATE_SHARED_MEDIA_SUCCESS } from '../types/selectedFriendType'

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

export const updateSharedMedia = (image: string) => {
    return async (dispatch: any) => {
        dispatch({
            type: UPDATE_SHARED_MEDIA_SUCCESS,
            payload: {
                imagePath: image
            }
        })
    }
}