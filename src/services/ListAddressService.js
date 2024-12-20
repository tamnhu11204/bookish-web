import axios from "axios"


export const addListAddress = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/create`, data)
    return res.data
}

export const getAllListAddress = async (data) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/get-all`, data)
    return res.data
}

export const updateListAddress = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/update/${id}`, data)
    return res.data
}

export const deleteListAddress = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/delete/${id}`)
    return res.data
}

export const getProvinces = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/province/get-all`);
};

export const getDistricts = async (provinceId) => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/district/get-all?provinceId=${provinceId}`);
};

export const getCommunes = async (districtId) => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/commue/get-all?districtId=${districtId}`);
};