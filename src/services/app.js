import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to create user: ${error.message}`);
  }
};

export const getUserByDeviceId = async (deviceId) => {
  try {
    const response = await api.get(`/users?deviceId=${deviceId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to get user by device ID: ${error.message}`);
  }
};

export const createLesson = async (lessonData) => {
  try {
    const response = await api.post('/lessons', lessonData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to create lesson: ${error.message}`);
  }
};

export const getLessons = async (levelId) => {
  try {
    console.log(`[services/app.js] Fetching lessons for levelId: ${levelId}`);
    const response = await api.get(`/lessons?level_id=${levelId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch lessons: ${error.message}`);
  }
};

export const getQuizzes = async (levelId) => {
  try {
    console.log(`[services/app.js] Fetching quizzes for levelId: ${levelId} from /quizzes`);
    const response = await api.get(`/quizzes?level_id=${levelId}`); 
    console.log('[services/app.js] getQuizzes API response:', response.data);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch quizzes: ${error.message}`);
  }
};

export const createCertificate = async (certificateData) => {
  try {
    const response = await api.post('/certificates', certificateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to create certificate: ${error.message}`);
  }
};

// <-- Các hàm mới để giao tiếp với User Progress API -->

export const getUserProgress = async (userId) => {
  try {
    console.log(`[services/app.js] Fetching user progress for userId: ${userId}`);
    const response = await api.get(`/user-progress/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`[services/app.js] No user progress found for userId: ${userId}`);
      return null;
    }
    console.error(`[services/app.js] Error fetching user progress for userId: ${userId}:`, error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || `Failed to get user progress: ${error.message}`);
  }
};

export const updateOrCreateUserProgress = async (userId, progressData) => {
  try {
    console.log(`[services/app.js] Saving user progress for userId: ${userId}`, progressData);
    const response = await api.put(`/user-progress/${userId}`, progressData); 
    return response.data;
  } catch (error) {
    console.error(`[services/app.js] Error saving user progress for userId: ${userId}:`, error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || `Failed to save user progress: ${error.message}`);
  }
};