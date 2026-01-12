import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// User endpoints
export const createOrGetUser = async (username) => {
    const response = await api.post('/users/auth', { username });
    return response.data;
};

export const getUserProgress = async (userId) => {
    const response = await api.get(`/users/${userId}/progress`);
    return response.data;
};

export const resetUserProgress = async (userId) => {
    const response = await api.post(`/users/${userId}/reset`);
    return response.data;
};

// Stage endpoints
export const getAllStages = async (userId = null) => {
    const response = await api.get('/stages', {
        params: userId ? { userId } : {}
    });
    return response.data;
};

export const validateStageKey = async (stageId, userId, submittedKey) => {
    const response = await api.post(`/stages/${stageId}/validate`, {
        userId,
        submittedKey
    });
    return response.data;
};

// Leaderboard endpoints
export const getLeaderboard = async () => {
    const response = await api.get('/leaderboard');
    return response.data;
};

// Timer endpoints
export const getTimer = async () => {
    const response = await api.get('/status');
    return response.data;
};

export const startTimer = async () => {
    const response = await api.post('/timer/start');
    return response.data;
};

export const stopTimer = async () => {
    const response = await api.post('/timer/stop');
    return response.data;
};

export default api;
