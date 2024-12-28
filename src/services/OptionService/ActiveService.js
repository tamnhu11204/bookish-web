import axios from "axios"

export const addActive=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/active/create`, data)
    return res.data
}

export const getAllActive=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/active/get-all`, data)
    return res.data
}

export const updateActive=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/active/update/${id}`, data)
    return res.data
}

export const deleteActive=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/active/delete/${id}`)
    return res.data
}