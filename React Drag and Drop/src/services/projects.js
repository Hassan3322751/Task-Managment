import axiosInstance from "../axiosConfig"

export const addProject = async (project) => {
    try {
        await axiosInstance.post('/tasks', project)
    } catch (error) {
        console.log(error)
    }
}

export const deleteProject = async (projectId) => {
    try {
        await axiosInstance.delete(`/tasks/${projectId}`)
    } catch (error) {
        console.log(error)
    }
}

export const getProjects = async () => {
    try {
        const res = await axiosInstance.get('/tasks')
        return res.data
    } catch (error) {
        console.log(error)
    }
}