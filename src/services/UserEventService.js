import axios from "axios";
import { getSessionId } from "../utils/session"; // ✅ Thêm dòng này

/**
 * Gửi sự kiện người dùng (đăng nhập hoặc khách vãng lai)
 * data gồm: { eventType, productId, userId?, sessionId? }
 */
export const trackUserEvent = async (data) => {
    const sessionId = getSessionId(); // ✅ Lấy sessionId (tự tạo nếu chưa có)

    const payload = {
        ...data,
        sessionId: data.sessionId || sessionId, // nếu chưa có thì thêm vào
    };

    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/events/track`, payload);
    return res.data;
};

/**
 * Lấy toàn bộ sự kiện (dành cho admin)
 */
export const getAllUserEvents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/events`);
    return res.data;
};

/**
 * Lấy sự kiện theo userId (nếu người dùng đã đăng nhập)
 */
export const getUserEventsByUser = async (userId) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/events/user/${userId}`);
    return res.data;
};

/**
 * Xóa toàn bộ sự kiện (dành cho admin / dọn dữ liệu)
 */
export const clearAllUserEvents = async () => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/events/clear`);
    return res.data;
};
