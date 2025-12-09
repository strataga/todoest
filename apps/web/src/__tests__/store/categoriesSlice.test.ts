import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer, {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
} from '@/store/categoriesSlice';
import { resetMockData } from '../mocks/handlers';

describe('categoriesSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    resetMockData();
    store = configureStore({
      reducer: { categories: categoriesReducer },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().categories;
      expect(state.items).toEqual([]);
      expect(state.fetchLoading).toBe(true);
      expect(state.createLoading).toBe(false);
      expect(state.updateLoadingIds).toEqual([]);
      expect(state.deleteLoadingIds).toEqual([]);
      expect(state.error).toBeNull();
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      store.dispatch({ type: 'categories/fetchCategories/rejected', payload: 'Test error' });

      store.dispatch(clearError());

      expect(store.getState().categories.error).toBeNull();
    });
  });

  describe('fetchCategories', () => {
    it('should fetch categories successfully', async () => {
      await store.dispatch(fetchCategories());

      const state = store.getState().categories;
      expect(state.fetchLoading).toBe(false);
      expect(state.items.length).toBeGreaterThan(0);
      expect(state.error).toBeNull();
    });

    it('should set loading to true when pending', () => {
      store.dispatch({ type: 'categories/fetchCategories/pending' });

      expect(store.getState().categories.fetchLoading).toBe(true);
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'categories/fetchCategories/rejected',
        payload: 'Failed to fetch',
      });

      const state = store.getState().categories;
      expect(state.fetchLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch');
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const initialLength = store.getState().categories.items.length;

      await store.dispatch(
        createCategory({
          name: 'New Category',
          color: 'hsl(200, 50%, 50%)',
        })
      );

      const state = store.getState().categories;
      expect(state.items.length).toBe(initialLength + 1);
      expect(state.items[state.items.length - 1].name).toBe('New Category');
    });

    it('should set loading when pending', () => {
      store.dispatch({ type: 'categories/createCategory/pending' });

      expect(store.getState().categories.createLoading).toBe(true);
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'categories/createCategory/rejected',
        payload: 'Failed to create',
      });

      const state = store.getState().categories;
      expect(state.createLoading).toBe(false);
      expect(state.error).toBe('Failed to create');
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      // First fetch categories
      await store.dispatch(fetchCategories());
      const category = store.getState().categories.items[0];

      await store.dispatch(
        updateCategory({
          id: category.id,
          updates: { name: 'Updated Name' },
        })
      );

      const state = store.getState().categories;
      const updated = state.items.find((c) => c.id === category.id);
      expect(updated?.name).toBe('Updated Name');
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'categories/updateCategory/rejected',
        payload: 'Failed to update',
        meta: { arg: { id: 'cat-1' } },
      });

      expect(store.getState().categories.error).toBe('Failed to update');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      // First fetch categories
      await store.dispatch(fetchCategories());
      const initialLength = store.getState().categories.items.length;
      const categoryId = store.getState().categories.items[0].id;

      await store.dispatch(deleteCategory(categoryId));

      const state = store.getState().categories;
      expect(state.items.length).toBe(initialLength - 1);
      expect(state.items.find((c) => c.id === categoryId)).toBeUndefined();
    });

    it('should handle error on rejection', () => {
      store.dispatch({
        type: 'categories/deleteCategory/rejected',
        payload: 'Failed to delete',
        meta: { arg: 'cat-1' },
      });

      expect(store.getState().categories.error).toBe('Failed to delete');
    });
  });
});
