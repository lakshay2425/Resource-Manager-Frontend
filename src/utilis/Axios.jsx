import axios from 'axios';
import toast from 'react-hot-toast';
import { getIsOnline, isWriteMethod, OFFLINE_WRITE_MESSAGE } from './networkStatus.js';
import {
  isPlanSessionInvalid,
  isTokenAuthFailure,
  isPlanLimitError,
  getPlanLimitType,
} from './planErrors.js';
import { notifyTokenAuthFailure } from './authSession.js';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (isPlanLimitError(error)) {
      error.planLimitType = getPlanLimitType(error);
      return Promise.reject(error);
    }

    if (isPlanSessionInvalid(error)) {
      if (!error.config?._planRetry) {
        error.config._planRetry = true;
        try {
          const { syncPlanCookie } = await import('../api/usersApi.js');
          await syncPlanCookie();
          return axiosInstance.request(error.config);
        } catch (syncError) {
          console.error('Plan cookie re-sync failed:', syncError);
        }
      }
    }

    if (isTokenAuthFailure(error) || (status === 401 && isPlanSessionInvalid(error))) {
      notifyTokenAuthFailure();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
