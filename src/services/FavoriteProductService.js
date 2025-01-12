import axios from "axios"

export const addFavoriteProduct = async (data) => {
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL_BACKEND}/favorite-product/create`,
            data
        );
        return res.data;
    } catch (error) {
        console.error("Error in addFavoriteProduct:", error);
        throw error;
    }
};


export const getAllFavoriteProduct=async(data)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/favorite-product/get-all`, data)
    return res.data
}

export const updateFavoriteProduct=async(id, data)=>{
    const res =await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/favorite-product/update/${id}`, data)
    return res.data
}

export const deleteFavoriteProduct=async(id)=>{
    const res =await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/favorite-product/delete/${id}`)
    return res.data
}

export const getDetailFavoriteProduct=async(id)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/favorite-product/get-detail/${id}`)
    return res.data
}

export const getAllFavoriteProductByUser=async(userId)=>{
    const res =await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/favorite-product/get-all?user=${userId}`)
    return res.data
}
