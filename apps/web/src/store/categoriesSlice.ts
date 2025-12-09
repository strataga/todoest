import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '@/types/todo';
import { categoriesApi, CreateCategoryDto, UpdateCategoryDto } from '@/api';

interface CategoriesState {
  items: Category[];
  // Per-operation loading states
  fetchLoading: boolean;
  createLoading: boolean;
  updateLoadingIds: string[];
  deleteLoadingIds: string[];
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  fetchLoading: true,
  createLoading: false,
  updateLoadingIds: [],
  deleteLoadingIds: [],
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await categoriesApi.getAll();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk<
  Category,
  CreateCategoryDto,
  { rejectValue: string }
>('categories/createCategory', async (data, { rejectWithValue }) => {
  try {
    return await categoriesApi.create(data);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create category');
  }
});

export const updateCategory = createAsyncThunk<
  Category,
  { id: string; updates: UpdateCategoryDto },
  { rejectValue: string }
>('categories/updateCategory', async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await categoriesApi.update(id, updates);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update category');
  }
});

export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoriesApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete category');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.fetchLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.createLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      // Update category
      .addCase(updateCategory.pending, (state, action) => {
        state.updateLoadingIds.push(action.meta.arg.id);
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.updateLoadingIds = state.updateLoadingIds.filter((id) => id !== action.payload.id);
        const index = state.items.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateLoadingIds = state.updateLoadingIds.filter((id) => id !== action.meta.arg.id);
        state.error = action.payload || 'An error occurred';
      })
      // Delete category
      .addCase(deleteCategory.pending, (state, action) => {
        state.deleteLoadingIds.push(action.meta.arg);
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoadingIds = state.deleteLoadingIds.filter((id) => id !== action.payload);
        state.items = state.items.filter((cat) => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleteLoadingIds = state.deleteLoadingIds.filter((id) => id !== action.meta.arg);
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
