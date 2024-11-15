import axiosInstance from "../axiosConfig"

export const getTask = async (taskId) => {
    try {
        const res = await axiosInstance.get(`/tasks/${taskId}`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteTask = async (taskId) => {
    try {
        const res = await axiosInstance.delete(`/tasks/${taskId}`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const addTask = async (task, stageId) => {
    try {
        const res = await axiosInstance.post(`/tasks`, {task, stageId})
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const updateTaskStage = async (taskId, stageId, position) => {
    try {
        const res = await axiosInstance.put(`/tasks/updateStage`, {taskId, stageId, position})
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const updateTaskOrder = async (taskId, updatedStage) => {
    try {
        const res = await axiosInstance.put(`/tasks/updateOrder`, {taskId, updatedStage})
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const getTasksByStage = async (stageId, page) => {
    try {
        const res = await axiosInstance.get(`/tasks`,  {
            params: { stageId, page }
        })
        return res.data
    } catch (error) {
        console.log(error)
        return []
    }
}