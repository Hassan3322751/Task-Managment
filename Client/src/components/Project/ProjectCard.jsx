import  "./ProjectCard.css";

import deleteIcon from "../../assets/delete.png";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ id, name, description, createdAt, handleDelete }) => {
    const navigate = useNavigate()
    function handleClick(e){
        if (e.target.closest('.task_delete')) {
            return;
        }
        navigate(`/project/${id}`);
    }
    
    return (
        <article className={`task_card`} onClick={(e) => handleClick(e)}>
            <div className='task_card_bottom_line'>
                <div className='task_card_tags'>
                    <b className='task_text'>{name}</b>
                    <p>{description}</p>
                </div>
                <button
                    className='task_delete'
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete(id)
                        }}
                    >
                    <img src={deleteIcon} className='delete_icon' alt='' />
                </button>
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