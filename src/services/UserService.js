import axios from "axios"

export const axiosJWT=axios.create()

export const loginUser=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/login`, data)
    return res.data
}

export const signupUser=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/signup`, data)
    return res.data
}

export const getDetailUser=async(id, access_token)=>{
    const res =await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-detail/${id}`, {
        headers:{
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const refreshToken=async()=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`, {
        withCredentials: true,
    })
    return res.data
}

export const logoutUser=async()=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/logout`)
    return res.data
}

export const updateUser=async(id, data, access_token)=>{
    const res =await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/user/update-user/${id}`, data,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}