import axios from "axios"

export const addUnit=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/unit/create`, data)
    return res.data
}

export const getAllUnit=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/unit/get-all`, data)
    return res.data
}