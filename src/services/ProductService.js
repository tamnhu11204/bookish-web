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

  export const getDetailProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-detail/${id}`);
    return res.data;
  };

  export const updateRating = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/update-rating/${id}`, data);
    return res.data;
  };

  export const updateRating2 = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/update-rating2/${id}`, data);
    return res.data;
  };

  export const deleteRating = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/delete-rating/${id}`, data);
    return res.data;
  };
  
  export const updateView = async (id) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/update-view/${id}`);
    return res.data;
  };
