
import { REGISTER_FAIL, REGISTER_SUCCESS, SUCCESS_MESSAGE_CLEAR, ERRORS_CLEAR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, UPLOAD_PROFILE_IMAGE_SUCCESS, UPDATE_USER_THEME_SUCCESS, UPDATE_USER_NAME_SUCCESS, UPDATE_USER_STATUS_SUCCESS } from "../actionTypes/authType"
import { jwtDecode } from "jwt-decode";
import { PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "@/ts/interfaces/interfaces";

interface AuthState {
    loading: boolean,
    authenticate: boolean,
    errors: string[],
    successMessage: string,
    myInfo: UserInfo
}

const authState: AuthState = {
    loading: true,
    authenticate: false,
    errors: [],
    successMessage: '',
    myInfo: {} as UserInfo,
}

const tokenDecode = (token: string) => {
    const tokenDecoded = jwtDecode(token);
    if (!tokenDecoded.exp) {
        return null;
    }
    const expTime = new Date(tokenDecoded.exp * 1000)
    if (new Date() > expTime) {
        return null;
    }
    return tokenDecoded
}

if (typeof localStorage !== 'undefined') {
    const getToken = localStorage.getItem('authToken');
    if (getToken) {
        const getInfo = tokenDecode(getToken)
        if (getInfo) {
            authState.myInfo = getInfo as UserInfo
            authState.authenticate = true;
            authState.loading = false;
        }
    }
}

export default function authReducer(state = authState, action: PayloadAction<{ error: string[], token: string, successMessage: string, profileImagePath: string, theme: string, name: string, status: string }>) {
    switch (action.type) {
        case REGISTER_FAIL:
            return {
                ...state,
                errors: action.payload.error,
                authenticate: false,
                myInfo: {} as UserInfo,
                loading: true
            }
        case LOGIN_FAIL:
            return {
                ...state,
                errors: action.payload.error,
                authenticate: false,
                myInfo: {} as UserInfo,
                loading: true
            }
        case REGISTER_SUCCESS:
            const reInfo = tokenDecode(action.payload.token)
            return {
                ...state,
                myInfo: reInfo as UserInfo,
                successMessage: action.payload.successMessage,
                errors: [],
                authenticate: true,
                loading: false
            }
        case LOGIN_SUCCESS:
            const logInfo = tokenDecode(action.payload.token)
            return {
                ...state,
                myInfo: logInfo as UserInfo,
                successMessage: action.payload.successMessage,
                errors: [],
                authenticate: true,
                loading: false
            }
        case SUCCESS_MESSAGE_CLEAR:
            return {
                ...state,
                successMessage: ''
            }
        case ERRORS_CLEAR:
            return {
                ...state,
                errors: []
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                authenticate: false,
                myInfo: {} as UserInfo,
                successMessage: 'Logout Successfull'
            }
        case UPLOAD_PROFILE_IMAGE_SUCCESS:
            return {
                ...state,
                myInfo: {
                    ...state.myInfo,
                    profileImage: action.payload.profileImagePath
                }
            }
        case UPDATE_USER_THEME_SUCCESS:
            return {
                ...state,
                myInfo: {
                    ...state.myInfo,
                    theme: action.payload.theme
                }   
            }
        case UPDATE_USER_NAME_SUCCESS: {
            return {
                ...state,
                myInfo: {
                    ...state.myInfo,
                    username: action.payload.name
                }
            }
        }
        case UPDATE_USER_STATUS_SUCCESS: {
            return {
                ...state,
                myInfo: {
                    ...state.myInfo,
                    status: action.payload.status
                }
            }
        }
        default:
            return state
    }
}