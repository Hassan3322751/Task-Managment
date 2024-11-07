import React, { useEffect, useState } from "react"
import ProjectCard from "../../components/Project/ProjectCard";

import './Projects.css'
import { addProject, getProjects, deleteProject } from "../../services/projects";

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", description: "" });

  useEffect(() => {
    const fnc = async() => {
      const projects = await getProjects();
      setProjects(projects)
    }
    fnc()
  }, [newTask])

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prevProjects) => prevProjects.filter((curElm) => curElm._id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }

  // Function to handle adding the new task to a project
  const handleAddTask = async () => {
    setProjects([...projects, { name: newTask.name, description: newTask.description }]);
    setNewTask({ name: "", description: "" });
    setIsModalOpen(false);
    await addProject(newTask)
  };

  return (
    <React.Fragment>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-blue-500 text-white p-2 rounded"
      >
          Add Task
      </button>
      <div className="projects" style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          projects.map((project, index) => (
            <ProjectCard
              key={index}
              id={project._id}
              name={project.name}
              description={project.description}
              createdAt={project.createdAt}
              handleDelete={handleDelete}
            />
          ))
        }

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
      </div>
    </React.Fragment>
  )
}

export default Projects