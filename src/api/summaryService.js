import apiClient from './apiClient';

export const summaryService = {
    generateSummary: async (summaryData) => {
        const response = await apiClient.post('/summarize', summaryData);
        return response.data;
    },
    getHistory: async (userId) => {
        const response = await apiClient.get(`/summarize/history?userId=${userId}`);
        return response.data;
    }
};
