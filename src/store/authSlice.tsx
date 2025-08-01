import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  user: { username: string } | null
  isLoggedIn: boolean
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string }>) {
      state.user = action.payload
      state.isLoggedIn = true
    },
    logout(state) {
      state.user = null
      state.isLoggedIn = false
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
