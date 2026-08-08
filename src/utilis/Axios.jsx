import axios from 'axios';
import toast from 'react-hot-toast';
import { getIsOnline, isWriteMethod, OFFLINE_WRITE_MESSAGE } from './networkStatus.js';

const backendURL = import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: backendURL, 
  withCredentials: true, 
  headers: {
    "Content-Type" : 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!getIsOnline() && isWriteMethod(config.method)) {
      toast.error(OFFLINE_WRITE_MESSAGE);
      return Promise.reject(new axios.Cancel(OFFLINE_WRITE_MESSAGE));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
