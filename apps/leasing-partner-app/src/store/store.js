import { api } from '@/features/api/api';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '@/features/auth/slice';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { rtkQueryErrorLogger } from '@/features/middleware/error';
import storage from './storage';
import rentalScheduleIdReducer from '@/features/rental-schedule/slice';

const store = configureStore({
  reducer: {
    auth: persistReducer(
      {
        key: 'tortoise:auth',
        storage,
        transforms: [
          encryptTransform({
            secretKey: process.env.NEXT_PUBLIC_PERSIST_FORM_SECRET,
            onError: (error) => {
              console.log('Encryption error:', error);
            },
          }),
        ],
      },
      authReducer
    ),
    rentalScheduleIdTab: rentalScheduleIdReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions:
          process.env.NODE_ENV !== 'production'
            ? [REHYDRATE]
            : [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware, rtkQueryErrorLogger),
  devTools: process.env.NODE_ENV !== 'production',
});

const persistor = persistStore(store);

export { persistor, store };

setupListeners(store.dispatch);
