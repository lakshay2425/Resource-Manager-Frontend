import { getPlanLimitMessage, isPlanLimitError } from './planErrors.js';

export const isDuplicateResourceError = (error) =>
  error?.response?.status === 409;

export const getDuplicateResourceMessage = (error) =>
  error?.response?.data?.message ??
  error?.response?.data?.error ??
  'A resource with this name and URL already exists';

export const getResourceErrorMessage = (error, fallback = 'Failed to create resource. Try again') => {
  if (isPlanLimitError(error)) {
    return getPlanLimitMessage(error);
  }
  if (isDuplicateResourceError(error)) {
    return getDuplicateResourceMessage(error);
  }
  return error?.response?.data?.message ?? error?.response?.data?.error ?? fallback;
};
