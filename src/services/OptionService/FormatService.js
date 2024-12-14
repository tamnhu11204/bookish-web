import axios from "axios"

export const addFormat=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/format/create`, data)
    return res.data
}

export const getAllFormat=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/format/get-all`, data)
    return res.data
}