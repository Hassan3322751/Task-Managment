import React, { useEffect, useState } from "react";
import "./Project.css";
import { useParams } from "react-router-dom";
import { getProject } from "../../services/projects";
import StageColumn from "../../components/Stage/StageColumn";
import { addStage, deleteStage, getStage } from "../../services/stages";
import { updateTaskOrder, updateTaskStage } from "../../services/tasks";

const Project = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null)
    const [stages, setStages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStage, setNewStage] = useState({ name: "" });

    const [activeCard, setActiveCard] = useState({
      stageId: null,
      stageIndex: null,
      cardId: null,
    })
    
    const fetchProject = async () => {
        try {
          const response = await getProject(id);
          setProject(response);

            if (response.stages && Array.isArray(response.stages)) {
                const stagePromises = response.stages.map(stageId => getStage(stageId));
                const stageData = await Promise.all(stagePromises);
                setStages(stageData);
            } else {
                setStages([]);
            }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
          fetchProject();
    }, [id]);

    const handleAddStage = async () => {  
        if (newStage.name.trim() === "") return;

        try {
            setIsModalOpen(false);
            const addedStage = await addStage(newStage.name, id); 
            setStages(prevStages => [...prevStages, addedStage]);
            setNewStage({ name: "" });
        } catch (error) {
            console.error("Error adding stage:", error);
        }
    };

    const handleDelete = async(stageId) => {
        try {
            await deleteStage(stageId);
            setStages((prevStages) => prevStages.filter((curElm) => curElm._id !== stageId));
            await fetchProject()
          } catch (error) {
            console.error('Failed to delete project:', error);
          }
    }

    const onDrop = async (destination, source) => {
      const { activeCard } = source;
      if (!destination) return;
    
      if (
        activeCard.stageId === destination.id &&
        activeCard.stageIndex === destination.index 
      ) {
        return;
      }
      else if (
        activeCard.stageId === destination.id &&
        destination.index === activeCard.stageIndex + 1
      ) {
        return;
      }
    
      try {
        setStages((prevStages) => {
          const newStages = [...prevStages];
  
          const sourceStage = newStages.find((stage) => stage._id === activeCard.stageId);
          const destinationStage = newStages.find((stage) => stage._id === destination.id);
    
          const sourceTaskIds = Array.from(sourceStage.taskIds);
          const destinationTaskIds = Array.from(destinationStage.taskIds);
    
          if (activeCard.stageId === destination.id) {
            const [movedTaskId] = sourceTaskIds.splice(activeCard.stageIndex, 1);
            sourceTaskIds.splice(destination.index, 0, movedTaskId);
          } else {
            const [movedTaskId] = sourceTaskIds.splice(activeCard.stageIndex, 1);
            destinationTaskIds.splice(destination.index, 0, movedTaskId);
          }
    
          const updatedStages = newStages.map((stage) => {
            if (stage._id === sourceStage._id) {
              return { ...stage, taskIds: sourceTaskIds };
            } else if (stage._id === destinationStage._id) {
              return { ...stage, taskIds: destinationTaskIds };
            }
            return stage;
          });
          
          handleDragEnd(activeCard.cardId, sourceStage._id, destination.id, destination.index, sourceTaskIds);
    
          return updatedStages;
        });
      } catch (error) {
        console.error("Failed to update task stage:", error);
      }
    };
    
    const handleDragEnd = async (taskId, sourceStageId, destinationStageId, newIndex, newTasksOrder) => {
      try {
        if (sourceStageId !== destinationStageId) {
          await updateTaskStage(taskId, destinationStageId, newIndex);
        } else {
          await updateTaskOrder(taskId, newTasksOrder);
        }
        await fetchProject();

      } catch (error) {
        console.error("Failed to update task stage/order in backend:", error);
      }
    };
    
    return(
        <React.Fragment>
            <p>Project - {id}</p>
            <p>Project Name - {project && project.name}</p>
            <p>Project Description - {project && project.description}</p>
            <p>Task Id - {activeCard.cardId}</p>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-500 text-white p-2 rounded"
            >
                Add Stage
            </button>
            <div className="stages">
            {
              stages && stages.map((stage, index) => stage && (
                <StageColumn
                  key={index} 
                  stage={stage}
                  id={stage._id}
                  title={stage.name}
                  handleDelete={handleDelete}
                  setActiveCard={setActiveCard}
                  activeCard={activeCard}
                  stageData={stages}
                  onDrop={onDrop}
                />
              ))
            }

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-bold mb-4">Add New Stage</h2>

                    <input
                        type="stage"
                        placeholder="Stage name"
                        value={newStage.name}
                        onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                        className="border p-2 w-full mb-4"
                    />

                    <div className="flex justify-end">
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-400 text-white p-2 rounded mr-2"
                        >
                        Cancel
                        </button>
                        <button onClick={handleAddStage} className="bg-blue-500 text-white p-2 rounded">
                            Add Stage
                        </button>
                    </div>
                    </div>
                </div>
                )}
            </div>
        </React.Fragment>
    ) 
};

export default Project;