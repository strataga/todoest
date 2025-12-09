import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TodoFilters, FilterStatus, SortBy, SortOrder } from '@/types/todo';

const initialState: TodoFilters = {
  status: 'all',
  categoryId: null,
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.status = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.categoryId = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
});

export const { setStatusFilter, setCategoryFilter, setSortBy, setSortOrder, toggleSortOrder } =
  filtersSlice.actions;
export default filtersSlice.reducer;
