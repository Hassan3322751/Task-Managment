import "./StageColumn.css";
import TaskCard from "../TaskCard";
import React, { useEffect, useState } from "react";
import { addTask, deleteTask, getTasksByStage } from "../../services/tasks";
import deleteIcon from '../../assets/delete.png';
import DropArea from "../DropArea/DropArea";

const StageColumn = ({ id, title, taskIds, handleDelete, activeCard, setActiveCard, stageData, onDrop }) => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ name: "", description: "", dueDate: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // Track loading state to avoid multiple simultaneous requests

    useEffect(() => {
        async function fnc(){
            const tasks = await fetchTasks(currentPage);
            setTasks(tasks);
        }
        fnc()
    }, [stageData]);
    
    const fetchTasks = async (page) => {
        if (isLoading) return; // Prevent multiple simultaneous requests
        setIsLoading(true);
        
        try {
            const data = await getTasksByStage(id, page);
            setHasMore(data.hasMore);
            return data.tasks
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const loadMoreTasks = async () => {
        if (hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
    
            try {
                const newTasks = await fetchTasks(nextPage);
                setTasks(prevTasks => [...prevTasks, ...newTasks]);
            } catch (error) {
                console.error("Error loading more tasks:", error);
            }
        }
    };
    

    const handleTaskDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleAddTask = async () => {
        setIsModalOpen(false);
        try {
            const addedTask = await addTask(newTask, id);
            setTasks((prevTasks) => [...prevTasks, addedTask]);
            setNewTask({ name: "", description: "", dueDate: null });
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    return (
        <section className='task_column' key={id}>
            <div className='task_column_heading'>
                <p>{title}</p>
                <button className="stage_delete" onClick={() => handleDelete(id)}>
                    <img className='delete_icon' src={deleteIcon} alt='' />
                </button>
            </div>
            <button className="bg-blue-500 text-white p-2 rounded w-100" onClick={() => setIsModalOpen(true)}>
                Add Task
            </button>
            <DropArea onDrop={() => onDrop({ id, index: 0 }, { activeCard })} />
            {tasks && tasks.map((task, index) => task &&(
                <React.Fragment key={task._id}>
                    <TaskCard
                        index={index}
                        id={task._id}
                        stageId={id}
                        title={task.title}
                        description={task.description}
                        dueDate={task.dueDate}
                        handleTaskDelete={handleTaskDelete}
                        setActiveCard={setActiveCard}
                    />
                    <DropArea onDrop={() => onDrop({ id, index: index + 1 }, { activeCard })} />
                </React.Fragment>
            ))}
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
                            value={newTask.dueDate ? newTask.dueDate : ""}
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