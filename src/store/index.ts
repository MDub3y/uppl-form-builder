import { configureStore } from '@reduxjs/toolkit';
import formBuilderReducer from './slices/formBuilderSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;