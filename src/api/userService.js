import apiClient from './apiClient';

export const userService = {
    getStatus: async (userData) => {
        const response = await apiClient.post('/user/status', userData);
        return response.data;
    }
};
