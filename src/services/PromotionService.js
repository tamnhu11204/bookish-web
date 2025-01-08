import axios from "axios"

export const addPromotion = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/create`, data)
    return res.data
}

export const updatePromotion = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/update/${id}`, data)
    return res.data
}

export const deletePromotion = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/delete/${id}`)
    return res.data
}

export const getAllPromotion = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/get-all`);
    return res.data;
  };

  export const getDetailPromotion = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/get-detail/${id}`)
    return res.data
}

export const updateUsedPromotion = async (id) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/promotion/update-used/${id}`)
    return res.data
}