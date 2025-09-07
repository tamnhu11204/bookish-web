/* eslint-disable no-throw-literal */
import axios from "axios";

// Bỏ qua kiểm tra chứng chỉ SSL trong môi trường phát triển
if (process.env.NODE_ENV === 'development') {
  console.log('Bypassing SSL verification in development mode');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const axiosJWT = axios.create();

// Gửi yêu cầu OTP để quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    console.log('Sending forgotPassword request to:', `${process.env.REACT_APP_API_URL_BACKEND}/auth/forgot-password`);
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/forgot-password`,
      { email }
    );
    return res.data;
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// Xác thực OTP
export const verifyOTP = async (email, otp) => {
  try {
    console.log('Sending verifyOTP request to:', `${process.env.REACT_APP_API_URL_BACKEND}/auth/verify-otp`);
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/verify-otp`,
      { email, otp }
    );
    return res.data;
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// Đặt lại mật khẩu mới
export const resetPassword = async (email, newPassword) => {
  try {
    console.log('Sending resetPassword request to:', `${process.env.REACT_APP_API_URL_BACKEND}/auth/reset-password`);
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/auth/reset-password`,
      { email, newPassword }
    );
    return res.data;
  } catch (error) {
    console.error('Error in resetPassword:', error);
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

// // Đăng nhập bằng Google
// export const loginWithGoogle = async (token) => {
//   try {
//     console.log('Sending loginWithGoogle request to:', `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/google`);
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/google`,
//       { token }
//     );
//     return res.data;
//   } catch (error) {
//     console.error('Error in loginWithGoogle:', error);
//     if (error.response) {
//       throw {
//         message: error.response.data?.message || "Đã xảy ra lỗi.",
//       };
//     } else {
//       throw { message: "Không thể kết nối đến máy chủ." };
//     }
//   }
// };

// // Đăng nhập bằng Facebook
// export const loginWithFacebook = async (token) => {
//   try {
//     console.log('Sending loginWithFacebook request to:', `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/facebook`);
//     const res = await axios.post(
//       `${process.env.REACT_APP_API_URL_BACKEND}/auth/login/facebook`,
//       { token }
//     );
//     return res.data;
//   } catch (error) {
//     console.error('Error in loginWithFacebook:', error);
//     if (error.response) {
//       throw {
//         message: error.response.data?.message || "Đã xảy ra lỗi.",
//       };
//     } else {
//       throw { message: "Không thể kết nối đến máy chủ." };
//     }
//   }
// };