import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setNetworkOnline } from '../utilis/networkStatus.js';

const OnlineStatusContext = createContext({
  isOnline: true,
});

export const OnlineStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkOnline(false);
    };

    setNetworkOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value = useMemo(() => ({ isOnline }), [isOnline]);

  return (
    <OnlineStatusContext.Provider value={value}>{children}</OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => useContext(OnlineStatusContext);
