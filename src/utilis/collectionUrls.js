const URL_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "Lakshay Mahajan" → "lakshay-mahajan" */
export const formatUsernameForUrl = (value) => {
  if (!value || typeof value !== 'string') return '';
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .join('-');
};

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

export const getCollectionPath = (username, slug) =>
  `/collections/${formatUsernameForUrl(username)}/${slug}`;

export const getResourceId = (resource) => resource?._id ?? resource?.id;
