export const OFFLINE_WRITE_MESSAGE =
  'Write operations are not supported while offline. Reconnect to create, edit, or delete.';

let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

export const getIsOnline = () => isOnline;

export const setNetworkOnline = (online) => {
  isOnline = online;
};

export const isWriteMethod = (method = 'GET') => {
  const normalized = method.toUpperCase();
  return !['GET', 'HEAD', 'OPTIONS'].includes(normalized);
};
