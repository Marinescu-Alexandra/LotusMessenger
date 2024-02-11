import { useAppDispatch } from "../hooks"
import { GET_SELECTED_FRIEND_SUCCESS, GET_SHARED_MEDIA_SUCCESS, UPDATE_SHARED_MEDIA_SUCCESS } from '../actionTypes/selectedFriendType'
import { Friend } from "@/ts/interfaces/interfaces"

export const getSelectedFriend = (data: Friend) => {
    return async (dispatch = useAppDispatch()) => {
        dispatch({
            type: GET_SELECTED_FRIEND_SUCCESS,
            payload: {
                selectedFriendData: data
            }
        })
    }
}

export const getSharedMedia = (data: string[]) => {
    return async (dispatch = useAppDispatch()) => {
        dispatch({
            type: GET_SHARED_MEDIA_SUCCESS,
            payload: {
                sharedMedia: data
            }
        })
    }
}

export const updateSharedMedia = (image: string) => {
    return async (dispatch = useAppDispatch()) => {
        dispatch({
            type: UPDATE_SHARED_MEDIA_SUCCESS,
            payload: {
                imagePath: image
            }
        })
    }
}