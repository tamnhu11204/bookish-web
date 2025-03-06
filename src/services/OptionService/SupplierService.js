import axios from "axios"

export const addSupplier=async(data)=>{
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/supplier/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data" ,
          },
        }
      );
      return res.data;
}

export const updateSupplier = async (id, formData) => {
  console.log("Gửi request update:", id, [...formData.entries()]);

  const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/supplier/update/${id}`,
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

export const getAllSupplier=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/supplier/get-all`, data)
    return res.data
}


export const deleteSupplier=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/supplier/delete/${id}`)
    return res.data
}

export const getDetailSupplier=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/supplier/get-detail/${id}`)
    return res.data
}