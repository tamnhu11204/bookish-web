// services/RecommendService.js
import axios from 'axios';
import { getSessionId } from '../../src/utils/session';

export const getRecommend = async (userId = null) => {
  const sessionId = getSessionId(); 

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/recommend/master/${userId || 'guest'}`,
      {
        user_id: userId || null,
        session_id: sessionId,
      },
      {
        timeout: 30000,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('[RecommendService] Lỗi:', error.response?.data || error.message);
    throw error;
  }
};