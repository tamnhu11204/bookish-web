import axios from "axios"

export const axiosJWT = axios.create()

export const getConfig = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/about-us/get-config`);
    return res.data;
};

export const updateConfig = async (formData, access_token) => {
    const res = await axiosJWT.put(
        `${process.env.REACT_APP_API_URL_BACKEND}/about-us/update-config`,
        formData, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}