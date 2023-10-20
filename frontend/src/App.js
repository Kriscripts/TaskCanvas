import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [originalTasks, setOriginalTasks] = useState([]);


  

  const handleCompleteToggle = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
  
    const taskToUpdate = updatedTasks.find((task) => task._id === taskId); // Use updatedTasks
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
  
    axios.put(`http://localhost:8080/tasks/${taskId}`, updatedTask)
      .then(() => {
        setTasks(updatedTasks);
      })
      .catch(error => console.log(error));
  };
  


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/tasks');
      setTasks(response.data);
      setOriginalTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  

  const addTask = async () => {
    try {
      await axios.post('http://localhost:8080/tasks', newTask);
      fetchTasks();
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const performSearch = () => {
    console.log('Searching tasks with query:', searchQuery);
    const filteredTasks = originalTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTasks(filteredTasks);
  };
 
  

  return (
    <div className="w3-row w3-margin-bottom">
      <h1 class="w3-container w3-center w3-teal w3-cursive">Task Manager</h1>
      <div className="w3-container w3-margin w3-padding ">
      <div  class="w3-container  w3-right w3-padding ">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          class="w3-panel w3-border w3-round-xxlarge"
        />
        <button onClick={performSearch} class="w3-black  w3-round-xxlarge ">Search</button>
      </div>
      
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          class="w3-panel w3-border w3-round-xxlarge"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          class="w3-panel w3-border w3-round-xxlarge"
        />
        <button onClick={addTask} class="w3-black  w3-round-xxlarge">Add Task</button>
       
      </div>
      <div class="w3-container w3-padding ">
      <h2 className="w3-Top Left">Task List</h2>
      
      <ul class="w3-card w3-ul w3-light-blue">
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong>- {task.description} ({task.completed ? 'Completed' : 'Pending'})
            <div><button onClick={() => handleCompleteToggle(task._id)} class="w3-button w3-border w3-border-black w3-hover-green">
                {task.completed ? 'Mark Pending' : 'Mark Completed'}
             </button>
            <button onClick={() => deleteTask(task._id)} className="w3-button w3-red w3-small w3-right w3-margin-left">Delete</button>
            </div>
            </li>
        ))}
      </ul>
       
      </div>
    </div>
  );
}


export default App;

