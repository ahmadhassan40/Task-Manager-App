// components/TaskItem.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteTask, toggleTaskStatus } from '../redux/tasksSlice';
import { deleteTaskFromDB, updateTaskStatusInDB } from '../db/database';

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await deleteTaskFromDB(task.id);
      dispatch(deleteTask(task.id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await updateTaskStatusInDB(task.id, !task.completed);
      dispatch(toggleTaskStatus(task.id));
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text
          style={[styles.text, task.completed && styles.completed]}
          numberOfLines={3}
          adjustsFontSizeToFit
        >
          {task.title}
        </Text>
      </View>
      <View style={styles.buttons}>
        <Button
          title={task.completed ? 'Undo' : 'Completed'}
          onPress={handleToggleStatus}
        />
        <Button title="Delete" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    color: '#343a40',
    fontWeight: '500',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#868e96',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonStyle: {
    marginHorizontal: 4,
  },
});

export default TaskItem;
