import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slides/counterSlide'
import userReducer from './slides/UserSlide'
import shopReducer from './slides/ShopSlide'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    shop: shopReducer,
  }
})