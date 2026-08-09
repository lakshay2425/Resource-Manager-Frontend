export const isDuplicateResourceError = (error) =>
  error?.response?.status === 409;

export const getDuplicateResourceMessage = (error) =>
  error?.response?.data?.message ??
  error?.response?.data?.error ??
  'A resource with this name and URL already exists';
