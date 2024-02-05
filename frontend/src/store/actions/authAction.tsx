import axios, { AxiosError } from 'axios';
import { useAppDispatch } from "../hooks"
import {
    REGISTER_FAIL, REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAIL, UPLOAD_PROFILE_IMAGE_SUCCESS, UPDATE_USER_THEME_SUCCESS,
    UPDATE_USER_STATUS_SUCCESS, UPDATE_USER_NAME_SUCCESS
} from '../types/authType';

const config = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
}

interface RegisterData {
    username: string,
    email: string,
    password: string,
}

interface LoginData {
    email: string,
    password: string,
}

export const userRegister = (data: RegisterData) => {
    return async (dispatch = useAppDispatch()) => {

        try {
            const response = await axios.post('http://localhost:5000/api/messenger/user-register', data, config);
            localStorage.setItem('authToken', response.data.token);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: {
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

export const userLogin = (data: LoginData) => {

    return async (dispatch = useAppDispatch()) => {
        
        try {
            const response = await axios.post('http://localhost:5000/api/messenger/user-login', data, config);
            localStorage.setItem('authToken', response.data.token);            
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
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

export const userLogout = () => async (dispatch = useAppDispatch()) => {
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

export const uploadUserProfileImage = (data: FormData) => async (dispatch = useAppDispatch()) => {
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
        localStorage.setItem('authToken', response.data.token);
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

export const updateUserTheme = (theme: string) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/update-user-theme', theme, config);
        localStorage.setItem('authToken', response.data.token);
        dispatch({
            type: UPDATE_USER_THEME_SUCCESS,
            payload: {
                theme: response.data.theme
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateUserName = (name: string) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/update-user-name', name, config);
        localStorage.setItem('authToken', response.data.token);
        dispatch({
            type: UPDATE_USER_NAME_SUCCESS,
            payload: {
                name: response.data.name
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const updateUserStatus = (status: string) => async (dispatch = useAppDispatch()) => {
    try {
        const response = await axios.post('http://localhost:5000/api/messenger/update-user-status', status, config);
        localStorage.setItem('authToken', response.data.token);
        dispatch({
            type: UPDATE_USER_STATUS_SUCCESS,
            payload: {
                status: response.data.status
            }
        })
    } catch (error) {
        console.log(error)
    }
}