import axios from 'axios';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '');
  }
  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const API_URL = getApiUrl();

export const shortenUrl = async (urlData) => {
  const res = await axios.post(`${API_URL}/api/urls/shorten`, urlData);
  return res.data;
};

export const getUrls = async () => {
  const res = await axios.get(`${API_URL}/api/urls`);
  return res.data;
};

export const getServerIp = async () => {
  const res = await axios.get(`${API_URL}/api/urls/server-ip`);
  return res.data;
};

export const editUrl = async (id, urlData) => {
  const res = await axios.put(`${API_URL}/api/urls/${id}`, urlData);
  return res.data;
};

export const deleteUrl = async (id) => {
  const res = await axios.delete(`${API_URL}/api/urls/${id}`);
  return res.data;
};
