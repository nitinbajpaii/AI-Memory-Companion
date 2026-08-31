import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

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
  sendTextMessage: (message, voiceGender, options = {}) => API.post('/chat/text', { message, voiceGender }, options),
  sendVoiceMessage: (message, voiceGender, options = {}) =>
    API.post('/chat/voice', { message, voiceGender }, options),
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
  getReviews:   () =>   API.get('/reviews'),
  submitReview: (data) => API.post('/reviews', data),
};

/**
 * voiceAPI — used by VoiceRecorder (audio file upload) and VoiceBubble (on-demand TTS).
 * These routes map to /api/voice/* in voiceRoutes.js.
 */
export const voiceAPI = {
  /**
   * Upload a recorded audio blob → transcribe → AI reply → (optional) audio back.
   * @param {FormData} formData  - must include 'audio' (Blob) and 'voiceType' ('male'|'female')
   */
  transcribe: (formData) =>
    API.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * On-demand TTS: given text + voiceType, returns base64 audio.
   */
  getTTS: (text, voiceType = 'female') =>
    API.post('/voice/tts', { text, voiceType }),
};

export default API;
