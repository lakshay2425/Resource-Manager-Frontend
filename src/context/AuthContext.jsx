import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gmail, setGmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const apiResponse = await axios.get(`${import.meta.env.VITE_AUTH_URL}/auth/google/verify`, {
        withCredentials: true
      })
      console.log(apiResponse, "Verify User Session API Respone")
      if (apiResponse.status === 200 && apiResponse.data.userInfo.userEmail) {
        setIsAuthenticated(true);
        setGmail(apiResponse.data.userInfo.userEmail);
      } else {
        setIsAuthenticated(false);
        setGmail("")
      }
    } catch (error) {
      console.log("Faled to verify", error.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
      checkAuthStatus();
  }, [])

  const authContextValue = {
    isAuthenticated,
    isLoading, setIsLoading,
    gmail,
    setGmail,
    setIsAuthenticated
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

