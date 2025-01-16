import axios from "axios"

export const addStaticPage=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/static-page/create`, data)
    return res.data
}

export const getAllStaticPage=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/static-page/get-all`, data)
    return res.data
}

export const updateStaticPage=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/static-page/update/${id}`, data)
    return res.data
}

export const deleteStaticPage=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/static-page/delete/${id}`)
    return res.data
}

export const getDetailStaticPage=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/static-page/get-detail/${id}`)
    return res.data
}