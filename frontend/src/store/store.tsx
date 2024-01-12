import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authReducer';
import { messengerReducer } from './reducers/messengerReducer';
import { selectedFriendReducer } from './reducers/selectedFriendReducer';

// Automatically adds the thunk middleware and the Redux DevTools extension
const store = configureStore({
    // Automatically calls `combineReducers`
    reducer: {
        auth: authReducer,
        messenger: messengerReducer,
        selectedFriend: selectedFriendReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;