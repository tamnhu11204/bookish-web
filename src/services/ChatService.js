import axios from 'axios';

export const axiosJWT = axios.create();

export const sendChatMessage = async (data, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["token"] = `Bearer ${token}`;
  }
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/chat/send`,
    data,
    { headers }
  );
  return res.data;
};

export const adminReplyToUser = async (userId, message, token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL_BACKEND}/chat/reply/${userId}`,
    { message },
    {
      headers: {
        token: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getConversationWithUser = async (userId, token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL_BACKEND}/chat/conversation/${userId}`,
    {
      headers: {
        token: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getAllUsersWithLatestMessage = async (token) => {
  console.log('💡 Gọi tới URL:', `${process.env.REACT_APP_API_URL_BACKEND}/chat/users`);
  console.log('Token:', token);
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/chat/users`, {
    headers: {
      token: `Bearer ${token}`,
    },
  });
  return res.data;
};