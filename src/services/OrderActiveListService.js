import axios from "axios"

export const createOrderActive = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/order-active/create`, data)
    return res.data
}

export const updateOrderActive = async (orderId, data) => {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL_BACKEND}/order-active/update/${orderId}`,
        data
    );
    return res;
};




export const getAllOrderActive = async (order) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/order-active/get-all?order=${order}`)
    return res.data
}
export const getDetailOrderActive = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/order-active/create/${id}`)
    return res.data
}

