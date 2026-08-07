const URL_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidSlug = (value) =>
  typeof value === 'string' &&
  value.length >= 1 &&
  value.length <= 80 &&
  URL_SEGMENT_PATTERN.test(value);

export const isValidUsername = (value) =>
  typeof value === 'string' &&
  value.length >= 1 &&
  value.length <= 50 &&
  URL_SEGMENT_PATTERN.test(value);

export const getCollectionPath = (username, slug) => `/collections/${username}/${slug}`;

export const getResourceId = (resource) => resource?._id ?? resource?.id;
