// src/utils/session.js
import { v4 as uuidv4 } from 'uuid';

/**
 * Lấy hoặc tạo sessionId lưu trong localStorage.
 * Dùng để định danh người dùng chưa đăng nhập.
 */
export const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');

  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }

  return sessionId;
};
