import React, { useEffect, useState } from "react";
import "./Project.css";
import { useParams } from "react-router-dom";
import { getProject } from "../../services/projects";

const Project = () => {
    const [activeProject, setActiveProject] = useState()
    const { id } = useParams();
    setActiveProject(id)
    
    useEffect(() => {
        (async function () {
        try {
            const response = await getProject(id);
            console.log(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        })();
    }, []);

    return(
        <React.Fragment>
            <div>Project - {id}</div>
        </React.Fragment>
    ) 
};

export default Project;
