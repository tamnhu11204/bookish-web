import axios from "axios"

export const addLanguage=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/language/create`, data)
    return res.data
}

export const getAllLanguage=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/language/get-all`, data)
    return res.data
}

export const updateLanguage=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/language/update/${id}`, data)
    return res.data
}

export const deleteLanguage=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/language/delete/${id}`)
    return res.data
}