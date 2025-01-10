import axios from "axios"

export const addFeedback = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/feedback/create`,
            data
        );
        return res.data;
    } catch (error) {
        console.error("Error in addFeedback:", error);
        throw error;
    }
};


export const getAllFeedback=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/feedback/get-all`, data)
    return res.data
}

export const updateFeedback=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/feedback/update/${id}`, data)
    return res.data
}

export const deleteFeedback=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/feedback/delete/${id}`)
    return res.data
}

export const getDetailFeedback=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/feedback/get-detail/${id}`)
    return res.data
}

export const getAllFeedbackByUser=async(userId)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/feedback/get-all?user=${userId}`)
    return res.data
}

export const getAllFeedbackByPro=async(proId)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/feedback/get-all?product=${proId}`)
    return res.data
}