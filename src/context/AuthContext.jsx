import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gmail, setGmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const apiResponse = await axios.get(`${import.meta.env.VITE_AUTH_URL}/auth/google/verify`, {
        withCredentials: true,
      });
      if (apiResponse.status === 200 && apiResponse.data.userInfo.userEmail) {
        const stored = readStoredUserInfo();
        const authInfo = apiResponse.data.userInfo;

        setIsAuthenticated(true);
        setGmail(authInfo.userEmail);
        setName(stored?.name ?? authInfo.name ?? '');
        setUsername(stored?.username ?? authInfo.username ?? '');
      } else {
        setIsAuthenticated(false);
        setGmail('');
        setName('');
        setUsername('');
      }
    } catch (error) {
      console.error('Faled to verify', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
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
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
