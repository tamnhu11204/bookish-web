import axios from "axios"

export const axiosJWT=axios.create()

export const loginUser=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/login`, data)
    return res.data
}

export const signupUser=async(data)=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/signup`, data)
    return res.data
}

export const getDetailUser=async(id, access_token)=>{
    const res =await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/user/get-detail/${id}`, {
        headers:{
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const refreshToken=async()=>{
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/refresh-token`, {
        withCredentials: true,
      });
    return res.data
}

export const logoutUser=async()=>{
    const res =await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/user/logout`)
    return res.data
}

export const updateUser=async(id, data, access_token)=>{
    const res =await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/user/update-user/${id}`, data,{
        headers:{
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const resetPassword = async (id, data, access_token) => {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_API_URL_BACKEND}/user/reset-password/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`, // Token gửi trong header
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error during password reset:", error.response?.data || error.message);
        throw error;
    }
};

export const getAllUserByAdmin = async (isAdmin, access_token) => {
  try {
      const isAdminString = isAdmin ? 'true' : 'false';
      //console.log('adsasf', isAdminString)

      const res = await axiosJWT.get(
          `${process.env.REACT_APP_API_URL_BACKEND}/user/get-all?isAdmin=${isAdminString}`, 
          {
              headers: {
                  token: `Bearer ${access_token}`,
              }
          }
      );

      return res.data;
  } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error fetching user data:', error);
      throw error; // Hoặc bạn có thể trả về một giá trị mặc định nếu cần
  }
}

export const deleteUser=async(id, access_token)=>{
  const res =await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/user/delete-user/${id}`,{
      headers:{
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}

export const toggleActiveUser=async(id, access_token)=>{
  const res =await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/user/toggle-active/${id}`,{
      headers:{
          token: `Bearer ${access_token}`,
      }
  })
  return res.data
}


///////////--------có phân quyền------------/////////////////////

export const getAllListAddress = async (user, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/get-all/${user}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,  // Đảm bảo sử dụng "Bearer" đúng cách
      }
    });
    return res.data;
  };

  export const updateListAddress = async (user,id,data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/update/${user}/${id}`, data,{
      headers: {
        Authorization: `Bearer ${access_token}`,  // Đảm bảo sử dụng "Bearer" đúng cách
      }
    });
    return res.data;
  };

  export const deleteListAddress = async (user,id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL_BACKEND}/listAddress/delete/${user}/${id}`,{
      headers: {
        Authorization: `Bearer ${access_token}`,  // Đảm bảo sử dụng "Bearer" đúng cách
      }
    });
    return res.data;
  };



