import { useState, useEffect } from "react";

export const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = (value) => {
    try {
      setState(value);
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }

      // 🔥 KEY FIX: Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('localStorage-change', {
        detail: { key, value }
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    // Listen for changes from other tabs (built-in storage event)
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          setState(e.newValue ? JSON.parse(e.newValue) : defaultValue);
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    // 🔥 KEY FIX: Listen for changes from the same tab (custom event)
    const handleCustomStorageChange = (e) => {
      if (e.detail.key === key) {
        setState(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange);
    };
  }, [key, defaultValue]);

  return [state, setValue];
};
