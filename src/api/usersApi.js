import axiosInstance from '../utilis/Axios.jsx';
import { formatUsernameForUrl } from '../utilis/collectionUrls.js';

const readStoredProfile = () => {
  try {
    const item = localStorage.getItem('userInfo');
    if (!item) return { name: '', username: '' };
    const parsed = JSON.parse(item);
    return {
      name: parsed?.name ?? '',
      username: formatUsernameForUrl(parsed?.username ?? parsed?.name ?? ''),
    };
  } catch {
    return { name: '', username: '' };
  }
};

export const checkUserExists = async () => {
  const { data } = await axiosInstance.get('/users/exists');
  return data?.exists ?? false;
};

export const createLocalUser = async ({ name, username }) => {
  const { data } = await axiosInstance.post('/users', { name, username });
  return data?.user ?? data;
};

export const ensurePlanCookie = async ({ name, username }) => {
  const exists = await checkUserExists();
  if (exists) {
    return { created: false, exists: true };
  }
  const user = await createLocalUser({ name, username });
  return { created: true, exists: false, user };
};

export const syncPlanCookie = async (profile = readStoredProfile()) => {
  const { name, username } = profile;
  const exists = await checkUserExists();
  if (!exists && name && username) {
    await createLocalUser({ name, username });
    return { exists: false, created: true };
  }
  return { exists, created: false };
};

export const ensureLocalUser = ensurePlanCookie;
