import axios, { AxiosError } from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAIL, UPLOAD_PROFILE_IMAGE_SUCCESS } from '../types/authType';

const config = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },

}

export const userRegister = (data: any) => {
    return async (dispatch: any) => {

        try {
            const response = await axios.post('http://localhost:5000/api/messenger/user-register', data, config);
            localStorage.setItem('authToken', response.data.token);
            dispatch({
                type: REGISTER_SUCCESS,
                playload: {
                    successMessage: response.data.successMessage,
                    token: response.data.token
                }
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                dispatch({
                    type: REGISTER_FAIL,
                    payload: {
                        error: error.response?.data.error.errorMessage
                    }
                })
            }
        }
    }
}

export const userLogin = (data: any) => {

    return async (dispatch: any) => {
        
        try {
            const response = await axios.post('http://localhost:5000/api/messenger/user-login', data, config);
            localStorage.setItem('authToken', response.data.token);            
            dispatch({
                type: LOGIN_SUCCESS,
                playload: {
                    successMessage: response.data.successMessage,
                    token: response.data.token
                }
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                dispatch({
                    type: LOGIN_FAIL,
                    payload: {
                        error: error.response?.data.error.errorMessage
                    }
                })
            }
        }

    }
}

export const userLogout = () => async (dispatch: any) => {
    const data = {}
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/user-logout', data, config)
        if (response.data.success) {
            localStorage.removeItem('authToken');
            dispatch({
                type: 'LOGOUT_SUCCESS'
            })
        }
    } catch(error) {
        console.log(error)
    }
}

export const uploadUserProfileImage = (data: any) => async (dispatch: any) => {
    const newConfig = {
        withCredentials: true,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
        },
        api: {
            bodyParser: false,
        },
    }
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/update-user-profile-picture', data, newConfig);
        dispatch({
            type: UPLOAD_PROFILE_IMAGE_SUCCESS,
            payload: {
                profileImagePath: response.data.profileImagePath
            }
        })
    } catch (error) {
        console.log(error)
    }
}