import axiosInstance from "../axiosConfig"

export const getStage = async (stageId) => {
    try {
        const res = await axiosInstance.get(`/stages/${stageId}`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const addStage = async (stage, projectId) => {
    try {
        const res = await axiosInstance.post(`/stages`, {stage, projectId})
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteStage = async (stageId) => {
    try {
        await axiosInstance.delete(`/stages/${stageId}`)
    } catch (error) {
        console.log(error)
    }
}