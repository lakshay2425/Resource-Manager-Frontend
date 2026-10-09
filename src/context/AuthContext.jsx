import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { syncPlanCookie } from '../api/usersApi.js';
import { registerTokenAuthFailureHandler } from '../utilis/authSession.js';
import {
  registerUsernameSetupRequiredHandler,
} from '../utilis/usernameSetup.js';
import UsernameSetupModal from '../components/UsernameSetupModal.jsx';

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
  const [isUsernameSetupOpen, setIsUsernameSetupOpen] = useState(false);
  const [suggestedUsername, setSuggestedUsername] = useState('');

  const clearSession = useCallback(() => {
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setGmail('');
    setName('');
    setUsername('');
    setIsUsernameSetupOpen(false);
  }, []);

  const openUsernameSetup = useCallback((suggestion = '') => {
    sessionStorage.removeItem('rh_username_setup_dismissed');
    setSuggestedUsername(suggestion ?? '');
    setIsUsernameSetupOpen(true);
  }, []);

  const dismissUsernameSetup = useCallback(() => {
    sessionStorage.setItem('rh_username_setup_dismissed', 'true');
    setIsUsernameSetupOpen(false);
  }, []);

  const handleUsernameConfigured = useCallback((configuredUsername) => {
    setUsername(configuredUsername);
    setIsUsernameSetupOpen(false);
    sessionStorage.removeItem('rh_username_setup_dismissed');
    const stored = readStoredUserInfo() ?? {};
    localStorage.setItem('userInfo', JSON.stringify({
      ...stored,
      name: stored.name ?? name,
      username: configuredUsername,
    }));
    toast.success('Username configured. You can now make resources and collections public.');
  }, [name]);

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

  useEffect(() => {
    registerUsernameSetupRequiredHandler(openUsernameSetup);
    return () => registerUsernameSetupRequiredHandler(null);
  }, [openUsernameSetup]);

  const checkAuthStatus = async () => {
    try {
      const apiResponse = await axios.get(`${import.meta.env.VITE_AUTH_URL}/auth/google/verify`, {
        withCredentials: true,
      });
      if (apiResponse.status === 200 && apiResponse.data.userInfo.userEmail) {
        const stored = readStoredUserInfo();
        const authInfo = apiResponse.data.userInfo;
        const resolvedName = stored?.name ?? authInfo.name ?? '';

        setIsAuthenticated(true);
        setGmail(authInfo.userEmail);
        setName(resolvedName);

        try {
          const account = await syncPlanCookie({ name: resolvedName });
          const resolvedUsername = account?.username ?? '';
          setUsername(resolvedUsername);
          localStorage.setItem('userInfo', JSON.stringify({
            ...(stored ?? {}),
            name: resolvedName,
            username: resolvedUsername,
          }));
          if (
            !account?.usernameConfigured &&
            sessionStorage.getItem('rh_username_setup_dismissed') !== 'true'
          ) {
            setSuggestedUsername(account?.suggestedUsername ?? '');
            setIsUsernameSetupOpen(true);
          }
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
    openUsernameSetup,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <UsernameSetupModal
        isOpen={isUsernameSetupOpen}
        suggestedUsername={suggestedUsername}
        onConfigured={handleUsernameConfigured}
        onDismiss={dismissUsernameSetup}
      />
    </AuthContext.Provider>
  );
};
