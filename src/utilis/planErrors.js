export const PLAN_SESSION_INVALID = 'Session invalid, please login again';
export const RESOURCE_LIMIT_MSG = 'You have reached the free tier limit of 50 resources';
export const COLLECTION_LIMIT_MSG = 'You have reached the free tier limit of 5 collections';

const getErrorMessage = (error) =>
  error?.response?.data?.message ?? error?.message ?? '';

export const isPlanSessionInvalid = (error) => {
  const status = error?.response?.status;
  const message = getErrorMessage(error);
  return status === 401 && message === PLAN_SESSION_INVALID;
};

export const isTokenAuthFailure = (error) => {
  if (isPlanSessionInvalid(error)) return false;

  const status = error?.response?.status;
  const message = getErrorMessage(error).toLowerCase();

  if (status === 400 && message.includes('token')) return true;
  if (status === 401 && message.includes('login again')) return true;

  return false;
};

export const isPlanLimitError = (error) => {
  const status = error?.response?.status;
  const message = getErrorMessage(error);
  return status === 403 && message.includes('free tier limit');
};

export const getPlanLimitType = (error) => {
  const message = getErrorMessage(error);
  if (message.includes('50 resources')) return 'resource';
  if (message.includes('5 collections')) return 'collection';
  return null;
};

export const getPlanLimitMessage = (error) => {
  const message = getErrorMessage(error);
  if (message) return message;

  const type = getPlanLimitType(error);
  if (type === 'resource') return RESOURCE_LIMIT_MSG;
  if (type === 'collection') return COLLECTION_LIMIT_MSG;

  return 'You have reached your free plan limit.';
};
