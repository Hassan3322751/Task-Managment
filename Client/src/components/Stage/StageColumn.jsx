import "./StageColumn.css";
import TaskCard from "../TaskCard";
import { useEffect, useState } from "react";
import { addTask, deleteTask, getTask } from "../../services/tasks";
import deleteIcon from '../../assets/delete.png'
import DatePicker from "react-datepicker";

const StageColumn = ({ id, title, taskIds, handleDelete }) => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ name: "", description: "", dueDate: null });
    
    useEffect(() => {
      const fetchProject = async () => {
        try {
          const tasksPromises = taskIds.map(taskId => getTask(taskId));
          const taskData = await Promise.all(tasksPromises);
          setTasks(taskData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchProject();
    }, [id]);

    const handleTaskDelete = async(taskId) => {
      try {
        await deleteTask(taskId);
        setTasks((prevTasks) => prevTasks.filter((curElm) => curElm._id !== taskId));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }

    const handleAddTask = async () => {
      console.log(newTask)
      setIsModalOpen(false);
      const addedTask = await addTask(newTask, id) 
      setTasks(prevTasks => [...prevTasks, addedTask]);
      setNewTask({ name: "", description: "", dueDate: null });
    };

    return (
        <section className='task_column'>
            <div className='task_column_heading'>
                <p>{title}</p>
                <button className="stage_delete" onClick={() => handleDelete(id)}>
                  <img className='delete_icon' src={deleteIcon} alt='' /> 
                </button>
            </div>
            
            <button className="bg-blue-500 text-white p-2 rounded w-100"
              onClick={() => setIsModalOpen(true)} 
            >
                Add Task
            </button>

            {tasks && tasks.map(
              (task, index) => (
                // task.status === status && (
                  <TaskCard
                    key={index}
                    id={task._id}
                    title={task.title}
                    description={task.description}
                    dueDate={task.dueDate}
                    handleTaskDelete={handleTaskDelete}
                  />
                )
            )}

{isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Add New Task</h2>

              <input
                type="text"
                placeholder="Task name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className="border p-2 w-full mb-4"
              />

              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="border p-2 w-full mb-4"
              ></textarea>

              <label htmlFor="due">Due Date:</label>
              <input
                id="due"
                type="date"
                placeholder="Due Date (dd/mm/yyyy)"
                value={newTask.dueDate ? newTask.dueDate : ''}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="border p-2 w-full mb-4"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button onClick={handleAddTask} className="bg-blue-500 text-white p-2 rounded">
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}
        </section>
    );
};

export default StageColumn;
