import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle 401 Unauthorized for session persistence
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data),
};

export const chatAPI = {
  sendMessage: (message) => API.post('/chat', { message }),
  getHistory: (userId) => API.get(`/chat/history/${userId}`),
};

export const profileAPI = {
  getProfile: (userId) => API.get(`/profile/${userId}`),
  createProfile: (data) => API.post('/profile/create', data),
  updateProfile: (id, data) => API.put(`/profile/update/${id}`, data),
};

export const memoryAPI = {
  getMemories: (userId) => API.get(`/memory/${userId}`),
  addMemory:   (data)   => API.post('/memory/add', data),
  deleteMemory:(id)     => API.delete(`/memory/${id}`),
};

export const reviewsAPI = {
  getReviews:    ()     => API.get('/reviews'),
  submitReview:  (data) => API.post('/reviews', data),
};

export const voiceAPI = {
  transcribe: (formData) =>
    API.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30_000,
    }),
  getTTS: (text, voiceType) => 
    API.post('/voice/tts', { text, voiceType }, { timeout: 20_000 }),
};

export default API;
