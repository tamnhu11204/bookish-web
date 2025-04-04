import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from './slides/counterSlide'
import userReducer from './slides/UserSlide'
import shopReducer from './slides/ShopSlide'
import orderReducer from './slides/OrderSlide'
import comparisonReducer from './slides/ComparisonSlide'

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['product', 'user', 'shop','favoriteproduct']
}

const rootReducer=combineReducers({
  counter: counterReducer,
    user: userReducer,
    shop: shopReducer,
    order: orderReducer,
    comparison: comparisonReducer, 

}
)

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)