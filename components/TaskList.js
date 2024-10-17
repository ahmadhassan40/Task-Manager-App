import React, { useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../redux/tasksSlice';
import TaskItem from './TaskItem';

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list); // Get the task list from Redux

  useEffect(() => {
    const loadTasks = async () => {
      await dispatch(fetchTasks());
      console.log("Tasks fetched:", tasks); // Check tasks after fetch
    };
    loadTasks();
  }, [dispatch]);

  if (!tasks || tasks.length === 0) {
    return <Text>No tasks available</Text>; // Handling empty state
  }

  return (
    <FlatList
      data={tasks} // No need to reverse if new tasks are added to the top
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TaskItem task={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#868e96',
    fontStyle: 'italic',
  },
});


export default TaskList;

