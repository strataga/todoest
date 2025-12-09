import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import categoriesReducer from './categoriesSlice';
import filtersReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    categories: categoriesReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
