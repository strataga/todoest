import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import filtersReducer, {
  setStatusFilter,
  setCategoryFilter,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
} from '@/store/filtersSlice';

describe('filtersSlice', () => {
  const createStore = () =>
    configureStore({
      reducer: { filters: filtersReducer },
    });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = createStore();
      const state = store.getState().filters;

      expect(state.status).toBe('all');
      expect(state.categoryId).toBeNull();
      expect(state.sortBy).toBe('dueDate');
      expect(state.sortOrder).toBe('asc');
    });
  });

  describe('setStatusFilter', () => {
    it('should set status to active', () => {
      const store = createStore();

      store.dispatch(setStatusFilter('active'));

      expect(store.getState().filters.status).toBe('active');
    });

    it('should set status to completed', () => {
      const store = createStore();

      store.dispatch(setStatusFilter('completed'));

      expect(store.getState().filters.status).toBe('completed');
    });

    it('should set status to all', () => {
      const store = createStore();
      store.dispatch(setStatusFilter('active'));

      store.dispatch(setStatusFilter('all'));

      expect(store.getState().filters.status).toBe('all');
    });
  });

  describe('setCategoryFilter', () => {
    it('should set category filter', () => {
      const store = createStore();

      store.dispatch(setCategoryFilter('cat-work'));

      expect(store.getState().filters.categoryId).toBe('cat-work');
    });

    it('should clear category filter', () => {
      const store = createStore();
      store.dispatch(setCategoryFilter('cat-work'));

      store.dispatch(setCategoryFilter(null));

      expect(store.getState().filters.categoryId).toBeNull();
    });
  });

  describe('setSortBy', () => {
    it('should set sort by dueDate', () => {
      const store = createStore();

      store.dispatch(setSortBy('dueDate'));

      expect(store.getState().filters.sortBy).toBe('dueDate');
    });

    it('should set sort by createdAt', () => {
      const store = createStore();

      store.dispatch(setSortBy('createdAt'));

      expect(store.getState().filters.sortBy).toBe('createdAt');
    });
  });

  describe('setSortOrder', () => {
    it('should set sort order to asc', () => {
      const store = createStore();

      store.dispatch(setSortOrder('asc'));

      expect(store.getState().filters.sortOrder).toBe('asc');
    });

    it('should set sort order to desc', () => {
      const store = createStore();

      store.dispatch(setSortOrder('desc'));

      expect(store.getState().filters.sortOrder).toBe('desc');
    });
  });

  describe('toggleSortOrder', () => {
    it('should toggle from asc to desc', () => {
      const store = createStore();

      store.dispatch(toggleSortOrder());

      expect(store.getState().filters.sortOrder).toBe('desc');
    });

    it('should toggle from desc to asc', () => {
      const store = createStore();
      store.dispatch(setSortOrder('desc'));

      store.dispatch(toggleSortOrder());

      expect(store.getState().filters.sortOrder).toBe('asc');
    });
  });
});
