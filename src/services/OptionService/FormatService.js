import axios from "axios"

export const addFormat=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/format/create`, data)
    return res.data
}

export const getAllFormat=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/format/get-all`, data)
    return res.data
}

export const updateFormat=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/format/update/${id}`, data)
    return res.data
}

export const deleteFormat=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/format/delete/${id}`)
    return res.data
}

export const getDetailFormat=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/format/get-detail/${id}`)
    return res.data
}