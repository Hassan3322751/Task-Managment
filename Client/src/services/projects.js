import axiosInstance from "../axiosConfig"

export const addProject = async (project) => {
    try {
        let res = await axiosInstance.post('/projects', project)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteProject = async (projectId) => {
    try {
        await axiosInstance.delete(`/projects/${projectId}`)
    } catch (error) {
        console.log(error)
    }
}

export const getProjects = async () => {
    try {
        const res = await axiosInstance.get('/projects')
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const getProject = async (id) => {
    try {
        const res = await axiosInstance.get(`/projects/${id}`)
        // console.log(res)    
        return res.data
    } catch (error) {
        console.log(error)
    }
}