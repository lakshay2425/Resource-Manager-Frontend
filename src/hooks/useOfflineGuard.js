import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useOnlineStatus } from '../context/OnlineStatusContext.jsx';
import { OFFLINE_WRITE_MESSAGE } from '../utilis/networkStatus.js';

export const useOfflineGuard = () => {
  const { isOnline } = useOnlineStatus();

  const guardWrite = useCallback(
    (action) => {
      if (!isOnline) {
        toast.error(OFFLINE_WRITE_MESSAGE);
        return false;
      }

      if (typeof action === 'function') {
        action();
      }

      return true;
    },
    [isOnline]
  );

  return { isOnline, guardWrite, writeDisabled: !isOnline };
};
