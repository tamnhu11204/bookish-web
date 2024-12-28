import axios from "axios"

export const addCategory=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/category/create`, data)
    return res.data
}

export const getAllCategory=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/category/get-all`, data)
    return res.data
}

export const updateCategory=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/category/update/${id}`, data)
    return res.data
}

export const deleteCategory=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/category/delete/${id}`)
    return res.data
}