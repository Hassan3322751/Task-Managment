import  "./ProjectCard.css";

import deleteIcon from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ id, name, description, createdAt, handleDelete }) => {
    const navigate = useNavigate()
    return (
        <article className={`task_card`} onClick={() => navigate(`/project/${id}`)}>
            <div className='task_card_bottom_line'>
                <div className='task_card_tags'>
                    <b className='task_text'>{name}</b>
                    <p>{description}</p>
                </div>
                <div
                    className='task_delete'
                        onClick={() => handleDelete(id)}
                    >
                    <img src={deleteIcon} className='delete_icon' alt='' />
                </div>
            </div>
            <div className='task_card_bottom_line'>
                <div className='task_card_tags'>
                    {createdAt}
                </div>
            </div>
        </article>
    );
};

export default ProjectCard;