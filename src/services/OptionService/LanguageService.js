import axios from "axios"

export const addLanguage=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/language/create`, data)
    return res.data
}

export const getAllLanguage=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/language/get-all`, data)
    return res.data
}