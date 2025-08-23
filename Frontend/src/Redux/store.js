import {combineReducers,configureStore} from '@reduxjs/toolkit'
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
import authSlice from './authSlice'
import pgSliceAdmin from './pgSliceAdmin'
import bookingSlice from './bookingSlice'
import profileSlice from './profileSlice'

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const rootReducer = combineReducers({
    auth:authSlice,
    pg:pgSliceAdmin,
    booking:bookingSlice,
    profile:profileSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});