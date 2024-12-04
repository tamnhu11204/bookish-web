import axios from "axios"

export const loginUser=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/login`, data)
    return res.data
}

export const signupUser=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/signup`, data)
    return res.data
}