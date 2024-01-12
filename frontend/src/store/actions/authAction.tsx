import axios, { AxiosError } from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAIL } from '../types/authType';

export const userRegister = (data: any) => {
    return async (dispatch: any) => {

        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }

        try {
            console.log(data)
            const response = await axios.post('http://localhost:5000/api/messenger/user-register', data, config);
            console.log(response)
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
                console.log(error)
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

        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }

        try {
            console.log(data)
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
                console.log(error)
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