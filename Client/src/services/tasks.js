import axiosInstance from "../axiosConfig"

export const getTask = async (taskId) => {
    try {
        const res = await axiosInstance.get(`/tasks/${taskId}`)
        console.log(res)
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