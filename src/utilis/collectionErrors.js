export const getCollectionErrorMessage = (error, fallback = 'Something went wrong.') => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message ?? error?.response?.data?.error;

  if (status === 400 && message?.toLowerCase().includes('token')) {
    return 'Please log in to continue.';
  }
  if (status === 401) {
    return message || 'Authentication required.';
  }
  if (status === 403) {
    return message || 'You do not have permission for this action.';
  }
  if (status === 404) {
    return message || 'Collection not found.';
  }
  if (status === 409) {
    const lower = (message ?? '').toLowerCase();
    if (lower.includes('slug')) {
      return 'This URL is already in use.';
    }
    if (lower.includes('username')) {
      return 'Username already taken.';
    }
    return message || 'This action conflicts with existing data.';
  }
  if (status === 429) {
    return message || 'Too many requests. Please wait and try again.';
  }

  return message || fallback;
};

export const isAuthError = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message ?? '';
  return status === 401 || (status === 400 && message.toLowerCase().includes('token'));
};
