import axios from 'axios';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '');
  }
  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const API_URL = getApiUrl();

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (username, email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
  return res.data;
};
