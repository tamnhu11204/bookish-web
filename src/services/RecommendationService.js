import axios from 'axios';

export const getRecommendations = async (userId) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/recommendation/recommend/${userId}`);
  return res.data;
};