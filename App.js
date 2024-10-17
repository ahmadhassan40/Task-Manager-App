import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet , FlatList, Text} from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store'; // Ensure this path is correct
import { addTask, fetchTasks } from './redux/tasksSlice';
import TaskItem from './components/TaskItem';
import { createTable, addTaskToDB } from './db/database';


const AppContent = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list); // Select tasks from Redux

  // Create the table and fetch tasks on startup
  useEffect(() => {
    createTable();
    dispatch(fetchTasks()); // Load tasks from DB into Redux state
  }, [dispatch]);

  const handleAddTask = async () => {
    // Regex to match only alphabets, numeric digits, and spaces
    const isValidTask = /^[A-Za-z0-9\s]+$/.test(taskTitle.trim());
  
    // Check if the task title is valid and not just whitespace
    if (!isValidTask || taskTitle.trim().length === 0) {
      setValidationMessage("Task title can only contain letters, numbers, and spaces, and cannot be empty.");
      return; // Prevent adding an invalid task
    }
  
    try {
      const newTask = await addTaskToDB({ title: taskTitle });
      dispatch(addTask(newTask)); // Add task to Redux state
      setTaskTitle(''); // Clear input field
      setValidationMessage(''); // Clear validation message
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Task Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      {validationMessage ? <Text style={styles.error}>{validationMessage}</Text> : null}
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TaskItem task={item} />}
      />
    </View>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f1f3f5',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
    color: '#343a40',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default App;