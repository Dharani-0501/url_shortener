import axios from 'axios';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '');
  }
  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const API_URL = getApiUrl();

export const getUrlAnalytics = async (id) => {
  const res = await axios.get(`${API_URL}/api/urls/${id}/analytics`);
  return res.data;
};
