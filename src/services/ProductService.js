import axios from "axios"

export const addProduct = async (newProduct) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/product/create`, newProduct)
    return res.newProduct
}

  

export const updateProduct = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/update/${id}`, data)
    return res.data
}

export const deleteProduct = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/product/delete/${id}`)
    return res.data
}

export const getAllProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all`);
    return res.data;
  };