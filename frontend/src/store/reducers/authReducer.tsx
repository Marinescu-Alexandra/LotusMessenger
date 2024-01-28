
import { REGISTER_FAIL, REGISTER_SUCCESS, SUCCESS_MESSAGE_CLEAR, ERRORS_CLEAR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT_SUCCESS, UPLOAD_PROFILE_IMAGE_SUCCESS, UPDATE_USER_THEME_SUCCESS } from "../types/authType"
import { jwtDecode } from "jwt-decode";

interface Dictionary<T> {
    [Key: string]: T;
}

interface AuthState {
    loading: boolean,
    authenticate: boolean,
    errors: string[],
    successMessage: string,
    myInfo: Dictionary<string>
}

const authState: AuthState = {
    loading: true,
    authenticate: false,
    errors: [],
    successMessage: '',
    myInfo: {},
}

const tokenDecode = (token: any) => {
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
            authState.myInfo = getInfo as Dictionary<string>
            authState.authenticate = true;
            authState.loading = false;
        }
    }
}

export default function authReducer(state = authState, action: any) {
    switch (action.type) {
        case REGISTER_FAIL:
            return {
                ...state,
                errors: action.payload.error,
                authenticate: false,
                myInfo: {},
                loading: true
            }
        case LOGIN_FAIL:
            return {
                ...state,
                errors: action.payload.error,
                authenticate: false,
                myInfo: {},
                loading: true
            }
        case REGISTER_SUCCESS:
            const reInfo = tokenDecode(action.playload.token)
            return {
                ...state,
                myInfo: reInfo as Dictionary<string>,
                successMessage: action.playload.successMessage,
                errors: [],
                authenticate: true,
                loading: false
            }
        case LOGIN_SUCCESS:
            const logInfo = tokenDecode(action.playload.token)
            return {
                ...state,
                myInfo: logInfo as Dictionary<string>,
                successMessage: action.playload.successMessage,
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
                myInfo: {},
                successMessage: 'Logout Successfull'
            }
        case UPLOAD_PROFILE_IMAGE_SUCCESS:
            return {
                ...state,
                myInfo: {
                    ...state.myInfo,
                    profileImage: String(action.payload.profileImagePath)
                }
            }
        case UPDATE_USER_THEME_SUCCESS:
            return {
                ...state,
                myInfo: {
                    ...state.myInfo,
                    theme: String(action.payload.theme)
                }   
            }

        default:
            return state
    }
}