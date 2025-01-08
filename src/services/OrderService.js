import axios from "axios"

export const createOrder = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/order/create`, data)
    return res.data
}

export const getAllOrder = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/order/get-all`)
    return res.data
}
export const getDetailOrder = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/order/get-detail/${id}`)
    return res.data
}

export const updateActiveOrderNow = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/order/update-active-now/${id}`, data)
    return res.data
}

export const getAllOrderByUser = async (user) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/order/get-all?user=${user}`)
    return res.data
}

export const updateCancel = async (id) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/order/update-cancel/${id}`)
    return res.data
}
