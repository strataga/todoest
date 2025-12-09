import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import todosReducer from '@/store/todosSlice';
import categoriesReducer from '@/store/categoriesSlice';
import filtersReducer from '@/store/filtersSlice';
import type { RootState } from '@/store/store';

// Default state helpers
export const getDefaultTodosState = () => ({
  items: [],
  fetchLoading: false,
  createLoading: false,
  updateLoadingIds: [],
  deleteLoadingIds: [],
  toggleLoadingIds: [],
  error: null,
});

export const getDefaultCategoriesState = () => ({
  items: [],
  fetchLoading: false,
  createLoading: false,
  updateLoadingIds: [],
  deleteLoadingIds: [],
  error: null,
});

export const getDefaultFiltersState = () => ({
  status: 'all' as const,
  categoryId: null,
  sortBy: 'dueDate' as const,
  sortOrder: 'asc' as const,
});

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
}

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      todos: todosReducer,
      categories: categoriesReducer,
      filters: filtersReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
