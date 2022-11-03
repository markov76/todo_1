import axios from 'axios';
import './App.css';
import {useEffect, useState} from 'react'

const URL = 'http://localhost/todo/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    axios.get(URL)
    .then((response) => {
      setTasks(response.data)
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }, [])

  const save = (e) => {
    e.preventDefault()
    const json = JSON.stringify({description:newTask})
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type':'application/json'
      }
    })
    .then((response) => {
      setTasks([...tasks,response.data])
      setNewTask('')
    }).catch(error => {
       console.log(error.response ? error.response.data.error : error)
       alert('häiriö') 
    })
  }

function remove(id) {
  const json = JSON.stringify({id:id})
  axios.post(URL + 'delete.php', json,{
    headers: {
      'Content-Type' : 'application/json'
    }
  })
  .then((response) => {
    const newListWithoutRemoved = tasks.filter((item) => item.id !==id);
    setTasks(newListWithoutRemoved);
  }).catch (error => {
    alert(error.response ? error.response.data.error : error);
  })
}

function setEditedTask(task) {
  setEditTask(task);
  setEditDescription(task?.description);
}

function update(e) {
  e.preventDefault();
  const json = JSON.stringify({id:editTask.id,description:editDescription})
  axios.post(URL + 'update.php',json,{
    headers: {
      'Content-Type' : 'application/json'
    }
  })
    .then((response) => {
      tasks[(tasks.findIndex(task => task.id === editTask.id))].description = editDescription;
      setTasks([...tasks]);
      setEditedTask(null);
    }).catch (error => {
      alert(error.response ? error.response.data.error : error);
    });
}

  return (
    <div className='container'>
      <form onSubmit={save}>
        <label>New task</label>
        <input value={newTask} onChange={e => setNewTask(e.target.value)} />
        <button>Save</button>
      </form>
      <ol>
        {tasks?.map(task => (
          <li key={task.id}>
            {editTask?.id !== task.id &&
              task.description
            } 
            {editTask?.id === task.id && 
              <form onSubmit={update}>
                <input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                <button>Save</button>
                <button type="button" onClick={() => setEditedTask(null)}>Cancel</button>
              </form>            
        }
        <a className='delete' onClick={() => remove(task.id)} href="#">    
              Delete
            </a>&nbsp;
            {editTask === null &&
               <a className='edit' onClick={() => setEditedTask(task)} href="#">
                Edit
               </a>
            }
          </li>
        ))}
      </ol>
    </div>
  ); 
}

export default App;
