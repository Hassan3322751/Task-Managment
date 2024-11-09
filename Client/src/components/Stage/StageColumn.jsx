import "./StageColumn.css";
import TaskCard from "../TaskCard";
import { useEffect, useState } from "react";
import { addTask, deleteTask, getTasksByStage } from "../../services/tasks";
import deleteIcon from '../../assets/delete.png'

import { Draggable, Droppable } from "react-beautiful-dnd";

const StageColumn = ({ id, title, taskIds, handleDelete }) => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ name: "", description: "", dueDate: null });

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    const fetchProject = async (page) => {
      try {
        const data = await getTasksByStage(id, page);
        setTasks([...data.tasks]); 
        setHasMore(data.hasMore); 
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
    };

    useEffect(() => {
      fetchProject(currentPage);
    }, []);

    const loadMoreTasks = () => {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProject(nextPage);
      setTasks((prevTasks) => [...prevTasks, ...tasks]);
  };

    const handleTaskDelete = async(taskId) => {
      try {
        await deleteTask(taskId);
        setTasks((prevTasks) => prevTasks.filter((curElm) => curElm._id !== taskId));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }

    const handleAddTask = async () => {
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
            <p>{id}</p>
            
            <button className="bg-blue-500 text-white p-2 rounded w-100"
              onClick={() => setIsModalOpen(true)} 
            >
                Add Task
            </button>

            <Droppable droppableId={id.toString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {tasks && tasks.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps} // This allows dragging by the handle
                        >
                          <TaskCard
                            id={task._id}
                            title={task.title}
                            description={task.description}
                            dueDate={task.dueDate}
                            handleTaskDelete={handleTaskDelete}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {hasMore && (
                <button onClick={loadMoreTasks} className="load_more_button bg-blue-500 text-white p-2 rounded w-100">
                    Load More
                </button>
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
