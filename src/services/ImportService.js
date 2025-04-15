import axios from "axios";

// Tạo một lần nhập hàng mới
export const createImport = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/imports/create`, data);
    return res.data;
};

// Lấy tất cả các lần nhập hàng
export const getAllImports = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/imports/get-all`);
    return res.data;
};

// Lấy chi tiết một lần nhập hàng
export const getImportById = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/imports/get-detail/${id}`);
    return res.data;
};

// Cập nhật trạng thái của lần nhập hàng
export const updateImportStatus = async (id, status) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/imports/update-status/${id}`, { status });
    return res.data;
};

// Xóa một lần nhập hàng
export const deleteImport = async (id) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/imports/delete/${id}`);
    return res.data;
};

// Lấy tất cả các lần nhập hàng theo user
export const getAllImportsByUser = async (user) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/imports/get-all?user=${user}`);
    return res.data;
};

// Cập nhật một lần nhập hàng
export const updateImport = async (id, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/imports/update/${id}`, data);
    return res.data;
};