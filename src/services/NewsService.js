import axios from "axios";

// Thêm tin tức
export const createNews = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/news/create`,data,
   {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
  return res.data;
};

// Cập nhật tin tức
export const updateNews = async (id, data, token) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL_BACKEND}/news/update/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Xoá tin tức
export const deleteNews = async (id, token) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL_BACKEND}/news/delete/${id}`,
   
  );
  return res.data;
};

// Lấy tất cả tin tức
export const getAllNews = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL_BACKEND}/news/get-all`
  );
  return res.data;
};

// Lấy chi tiết tin tức
export const getNewsDetail = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL_BACKEND}/news/get-detail/${id}`
  );
  return res.data;
};
