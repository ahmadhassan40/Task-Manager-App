
// database.js

// db/database.js
import { openDatabase } from 'expo-sqlite/legacy';

const db = openDatabase('tasks.db');

// Function to create the tasks table if it doesn't exist
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      );`,
      [],
      () => console.log('Table created successfully'),
      (tx, error) => console.error('Error creating table:', error)
    );
  });
};

// Add a task to the database
export const addTaskToDB = (task) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO tasks (title, completed) VALUES (?, ?);',
        [task.title, 0],
        (_, { insertId }) => {
          console.log('Task added with ID:', insertId);
          resolve({ id: insertId, title: task.title, completed: false });
        },
        (_, error) => {
          console.error('Error adding task:', error);
          reject(error);
        }
      );
    });
  });
};

export const fetchTasksFromDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tasks ORDER BY id DESC', // Ensures latest task is on top
        [],
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error)
      );
    });
  });
};

// Fetch all tasks from the database
export const getTasksFromDB = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM tasks;',
      [],
      (_, { rows }) => {
        const tasks = rows._array.map((task) => ({
          ...task,
          completed: task.completed === 1, // Convert 1/0 to true/false
        }));
        resolve(tasks);
        console.log('Tasks retrieved from database:', rows._array);
        callback(rows._array);
      },
      (tx, error) => {
        console.error('Error fetching tasks:', error);
        callback([]);
      }
    );
  });
};

// Delete a task from the database
export const deleteTaskFromDB = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM tasks WHERE id = ?;',
        [id],
        () => {
          console.log('Task deleted with ID:', id);
          resolve();
        },
        (_, error) => {
          console.error('Error deleting task:', error);
          reject(error);
        }
      );
    });
  });
};


export const updateTaskStatusInDB = (id, completed) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE tasks SET completed = ? WHERE id = ?;',
        [completed ? 1 : 0, id],
        () => {
          console.log('Task status updated:', id);
          resolve();
        },
        (_, error) => {
          console.error('Error updating task status:', error);
          reject(error);
        }
      );
    });
  });
};
