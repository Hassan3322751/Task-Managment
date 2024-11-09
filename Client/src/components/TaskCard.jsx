import "./TaskCard.css";
import deleteIcon from "../assets/delete.png";

const TaskCard = ({ id, title, description, dueDate, handleTaskDelete }) => {
    return (
        <article className='task_card' id={id}>
            <div className="card_header">
                <p className='task_text'>{title}</p>

                <button className="task_delete" onClick={() => handleTaskDelete(id)}>
                    <img src={deleteIcon} className='delete_icon' alt='' />
                </button>
            </div>
            <p>{description}</p>
            <span className="text-red-500">Due: {dueDate}</span>
        </article>
    );
};

export default TaskCard;
