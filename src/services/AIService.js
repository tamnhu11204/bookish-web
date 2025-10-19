import axios from 'axios';

export const searchBooks = async (query) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/search`, { query });
        if (response.data.status === 'ERR') {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error('Error in SearchService:', error.message);
        throw new Error(error.message || 'Failed to search books');
    }
};
