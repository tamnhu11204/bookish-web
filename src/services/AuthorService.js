import axios from "axios";

export const addAuthor = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/author/create`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};

export const updateAuthor = async (id, formData) => {
    const res = await axios.put(
        `${process.env.REACT_APP_API_URL_BACKEND}/author/update/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};

export const getAllAuthor = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/author/get-all`);
    return res.data;
};

export const deleteAuthor = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/author/delete/${id}`);
    return res.data;
};

export const getDetailAuthor = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/author/get-detail/${id}`);
    return res.data;
};