import axios from "axios"

export const addProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/product/create`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
}

export const updateProduct = async (id, formData) => {
  console.log("Gửi request update:", id, [...formData.entries()]);

  const res = await axios.put(
    `${process.env.REACT_APP_API_URL_BACKEND}/product/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("Kết quả response:", res.data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/product/delete/${id}`)
  return res.data
}

export const getAllProduct = async (queryString = '') => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all${queryString}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
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

export const updateProductStock = async (id, data) => {
  const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/update-stock/${id}`, data);
  return res.data;
};

export const getAllProductBySort = async (params = {}) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all`, {
    params: {
      ...params,
      sort: params.sort ? JSON.stringify(params.sort) : undefined,
    },
  });

  return response.data;
};

export const softDeleteProduct = async (id) => {
  const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/soft-delete/${id}`)
  return res.data
}

