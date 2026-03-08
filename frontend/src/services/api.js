import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ctf-zubh.onrender.com/api';

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

export const unlockHint = async (stageId, userId) => {
    const response = await api.post(`/stages/${stageId}/unlock-hint`, {
        userId
    });
    return response.data;
};

export const submitMcqAnswer = async (stageId, userId, selectedIndex) => {
    const response = await api.post(`/stages/${stageId}/mcq`, {
        userId,
        selectedIndex
    });
    return response.data;
};


// Leaderboard endpoints
export const getLeaderboard = async () => {
    const response = await api.get('/leaderboard');
    return response.data;
};

// Lobby endpoints
export const getLobbyStatus = async () => {
    const response = await api.get('/lobby/status');
    return response.data;
};

// Admin endpoints
export const adminStartCTF = async (password) => {
    const response = await api.post('/admin/start-ctf', { password });
    return response.data;
};

export const adminStopCTF = async (password) => {
    const response = await api.post('/admin/stop-ctf', { password });
    return response.data;
};

export default api;
