import axios from "axios"

export const addStatus=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/status/create`, data)
    return res.data
}

export const getAllStatus=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/status/get-all`, data)
    return res.data
}

export const updateStatus=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/status/update/${id}`, data)
    return res.data
}


export const deleteStatus=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/status/delete/${id}`)
    return res.data
}

