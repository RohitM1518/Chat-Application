import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    loading: false,
    error: false,
    accessToken: "",
    refreshToken: "",
    authStatus:false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload.user
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.authStatus = true
        },
        loginFailure: (state) => {
            state.loading = false
            state.error = true
        },
        logout: (state) => {
            state.currentUser = null
            state.error = false
            state.loading = false
            state.accessToken = ""
            state.refreshToken = ""
            state.authStatus = false
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginStart, loginFailure, loginSuccess, logout } = userSlice.actions

export default userSlice.reducer