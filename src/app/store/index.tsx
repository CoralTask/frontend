import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../features/auth/presentation/store/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})