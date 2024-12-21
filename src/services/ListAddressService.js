import axios from "axios"
export const axiosJWT = axios.create() 
  

export const addListAddress = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/create`, data)
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

export const getDistricts = async (province) => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/district/get-all?province=${province}`);
};

export const getCommunes = async (district) => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/commune/get-all?district=${district}`);
};

export const getCommuneDetail = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/commune/get-detail/${id}`);
};

export const getDistrictDetail = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/district/get-detail/${id}`);
};

export const getProvinceDetail = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/province/get-detail/${id}`);
};