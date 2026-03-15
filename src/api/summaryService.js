import apiClient from './apiClient';

export const summaryService = {
    generateSummary: async (summaryData) => {
        // summaryData can now include { content, url, title, userId, tone }
        const response = await apiClient.post('/summarize', summaryData);
        return response.data;
    },
    getHistory: async (userId) => {
        const response = await apiClient.get(`/summarize/history?userId=${userId}`);
        return response.data;
    },
    deleteSummary: async (id) => {
        const response = await apiClient.delete(`/summarize/${id}`);
        return response.data;
    }
};
