import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatUsernameForUrl } from '../utilis/collectionUrls.js';
import { syncPlanCookie } from '../api/usersApi.js';
import { registerTokenAuthFailureHandler } from '../utilis/authSession.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const readStoredUserInfo = () => {
  try {
    const item = localStorage.getItem('userInfo');
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gmail, setGmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setGmail('');
    setName('');
    setUsername('');
  }, []);

  const handleTokenAuthFailure = useCallback(async () => {
    try {
      await axios.post(`${import.meta.env.VITE_AUTH_URL}/users/logout`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error('Logout after auth failure failed:', error);
    } finally {
      clearSession();
      navigate('/');
      toast.error('Your session has expired. Please log in again.');
    }
  }, [clearSession, navigate]);

  useEffect(() => {
    registerTokenAuthFailureHandler(handleTokenAuthFailure);
  }, [handleTokenAuthFailure]);

  const checkAuthStatus = async () => {
    try {
      const apiResponse = await axios.get(`${import.meta.env.VITE_AUTH_URL}/auth/google/verify`, {
        withCredentials: true,
      });
      if (apiResponse.status === 200 && apiResponse.data.userInfo.userEmail) {
        const stored = readStoredUserInfo();
        const authInfo = apiResponse.data.userInfo;
        const resolvedName = stored?.name ?? authInfo.name ?? '';
        const resolvedUsername = formatUsernameForUrl(
          stored?.username ?? authInfo.username ?? authInfo.name ?? ''
        );

        setIsAuthenticated(true);
        setGmail(authInfo.userEmail);
        setName(resolvedName);
        setUsername(resolvedUsername);

        try {
          await syncPlanCookie({ name: resolvedName, username: resolvedUsername });
        } catch (syncError) {
          console.error('Plan cookie sync failed on session restore:', syncError);
        }
      } else {
        clearSession();
      }
    } catch (error) {
      console.error('Faled to verify', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authContextValue = {
    isAuthenticated,
    isLoading,
    setIsLoading,
    gmail,
    setGmail,
    name,
    setName,
    username,
    setUsername,
    setIsAuthenticated,
    clearSession,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
