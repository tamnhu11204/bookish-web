
import axios from "axios"

export const getDetailShop=async()=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/shop-profile/get-detail/676ad6df6afcce8a8ea781df`)
    return res.data
}

export const updateShop=async(data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/shop-profile/update/676ad6df6afcce8a8ea781df`, data)
    return res.data
}

export const updateImg=async(data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/shop-profile/update-img/676ad6df6afcce8a8ea781df`, data)
    return res.data
}

export const updateShop2=async(data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/shop-profile/update-fee/676ad6df6afcce8a8ea781df`, data)
    return res.data
}
