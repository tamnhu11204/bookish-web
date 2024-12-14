import axios from "axios"

export const addPublisher=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/publisher/create`, data)
    return res.data
}

export const getAllPublisher=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/publisher/get-all`, data)
    return res.data
}

export const updatePublisher=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/publisher/update`, data)
    return res.data
}


