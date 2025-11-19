// services/RecommendService.js → SỬA THÀNH POST (CHẠY NGON NGAY!)
import axios from 'axios';

export const getRecommend = async (userId) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/recommend/master/${userId}`,
    {} // body trống cũng được
  );
  return res.data;
};