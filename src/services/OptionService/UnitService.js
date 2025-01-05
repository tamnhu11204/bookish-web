import axios from "axios"

export const addUnit=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/unit/create`, data)
    return res.data
}

export const getAllUnit=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/unit/get-all`, data)
    return res.data
}

export const updateUnit=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/unit/update/${id}`, data)
    return res.data
}

export const deleteUnit=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/unit/delete/${id}`)
    return res.data
}

export const getDetailUnit=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/unit/get-detail/${id}`)
    return res.data
}