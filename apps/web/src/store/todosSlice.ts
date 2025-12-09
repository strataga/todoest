import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '@/types/todo';
import { todosApi, CreateTodoDto, UpdateTodoDto } from '@/api';

interface TodosState {
  items: Todo[];
  // Per-operation loading states
  fetchLoading: boolean;
  createLoading: boolean;
  updateLoadingIds: string[];
  deleteLoadingIds: string[];
  toggleLoadingIds: string[];
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  fetchLoading: true,
  createLoading: false,
  updateLoadingIds: [],
  deleteLoadingIds: [],
  toggleLoadingIds: [],
  error: null,
};

// Async thunks
export const fetchTodos = createAsyncThunk<Todo[], void, { rejectValue: string }>(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      return await todosApi.getAll();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch todos');
    }
  }
);

export const createTodo = createAsyncThunk<Todo, CreateTodoDto, { rejectValue: string }>(
  'todos/createTodo',
  async (data, { rejectWithValue }) => {
    try {
      return await todosApi.create(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create todo');
    }
  }
);

export const updateTodo = createAsyncThunk<
  Todo,
  { id: string; updates: UpdateTodoDto },
  { rejectValue: string }
>('todos/updateTodo', async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await todosApi.update(id, updates);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update todo');
  }
});

export const deleteTodo = createAsyncThunk<string, string, { rejectValue: string }>(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await todosApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete todo');
    }
  }
);

export const toggleTodo = createAsyncThunk<Todo, string, { rejectValue: string }>(
  'todos/toggleTodo',
  async (id, { rejectWithValue }) => {
    try {
      return await todosApi.toggleComplete(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to toggle todo');
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.fetchLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      // Create todo
      .addCase(createTodo.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.createLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || 'An error occurred';
      })
      // Update todo
      .addCase(updateTodo.pending, (state, action) => {
        state.updateLoadingIds.push(action.meta.arg.id);
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.updateLoadingIds = state.updateLoadingIds.filter((id) => id !== action.payload.id);
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.updateLoadingIds = state.updateLoadingIds.filter((id) => id !== action.meta.arg.id);
        state.error = action.payload || 'An error occurred';
      })
      // Delete todo
      .addCase(deleteTodo.pending, (state, action) => {
        state.deleteLoadingIds.push(action.meta.arg);
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoadingIds = state.deleteLoadingIds.filter((id) => id !== action.payload);
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.deleteLoadingIds = state.deleteLoadingIds.filter((id) => id !== action.meta.arg);
        state.error = action.payload || 'An error occurred';
      })
      // Toggle todo
      .addCase(toggleTodo.pending, (state, action) => {
        state.toggleLoadingIds.push(action.meta.arg);
        state.error = null;
      })
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.toggleLoadingIds = state.toggleLoadingIds.filter((id) => id !== action.payload.id);
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.toggleLoadingIds = state.toggleLoadingIds.filter((id) => id !== action.meta.arg);
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { clearError } = todosSlice.actions;
export default todosSlice.reducer;
