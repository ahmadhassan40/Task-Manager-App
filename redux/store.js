import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice'; // Import your slice

const store = configureStore({
  reducer: {
    tasks: tasksReducer, // Add your tasks reducer here
  },
});

export default store;

