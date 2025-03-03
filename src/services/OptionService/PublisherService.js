import axios from "axios"

export const addPublisher=async(data)=>{
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL_BACKEND}/publisher/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data" ,
          },
        }
      );
      return res.data;
}

export const updatePublisher = async (id, formData) => {
  console.log("Gửi request update:", id, [...formData.entries()]);

  const res = await axios.put(
      `${process.env.REACT_APP_API_URL_BACKEND}/publisher/update/${id}`,
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

export const getAllPublisher=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/publisher/get-all`, data)
    return res.data
}



export const deletePublisher=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/publisher/delete/${id}`)
    return res.data
}

export const getDetailPublisher=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/publisher/get-detail/${id}`)
    return res.data
}



