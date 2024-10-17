import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasksFromDB} from '../db/database';

// Fetch tasks from SQLite database
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const tasks = await fetchTasksFromDB();
  return tasks; // Already sorted by latest first
});

// Slice for managing tasks
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [] },
  reducers: {
    addTask: (state, action) => {
      state.list.unshift(action.payload); // Add task to the beginning of the list
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter((task) => task.id !== action.payload);
    },
    toggleTaskStatus: (state, action) => {
      const task = state.list.find((t) => t.id === action.payload);
      if (task) {
        task.completed = !task.completed; // Toggle task completion status
      }
    },
    // fetchTasks: (state, action) => {
    //   state.list = action.payload.reverse(); // Ensure existing tasks show in reverse order
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.list = action.payload; // Load tasks into state
    });
  },
});

export const { addTask, deleteTask, toggleTaskStatus } = tasksSlice.actions; 
export default tasksSlice.reducer;