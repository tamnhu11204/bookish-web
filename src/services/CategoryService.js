import axios from "axios"

export const addCategory=async(data)=>{
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/category/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data" ,
          },
        }
      );
      return res.data;
}

export const updateCategory = async (id, formData) => {
  console.log("Gửi request update:", id, [...formData.entries()]);

  const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/category/update/${id}`,
      formData,
      {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      }
  );

  console.log("Kết quả response:", res.data);
  return res.data;
};

export const getAllCategory=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/category/get-all`, data)
    return res.data
}


export const deleteCategory=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/category/delete/${id}`)
    return res.data
}

export const getDetailCategory=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/category/get-detail/${id}`)
    return res.data
}

export const getTreeCategory=async(id)=>{
  const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/category/get-tree`)
  return res.data
}