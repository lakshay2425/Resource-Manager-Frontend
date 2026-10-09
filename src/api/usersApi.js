import axiosInstance from '../utilis/Axios.jsx';

const readStoredProfile = () => {
  try {
    const item = localStorage.getItem('userInfo');
    if (!item) return { name: '', username: '' };
    const parsed = JSON.parse(item);
    return {
      name: parsed?.name ?? '',
      username: parsed?.username ?? '',
    };
  } catch {
    return { name: '', username: '' };
  }
};

export const getUserAccountStatus = async () => {
  const { data } = await axiosInstance.get('/users/exists');
  return data;
};

export const checkUserExists = async () => {
  const account = await getUserAccountStatus();
  return account?.exists ?? false;
};

export const createLocalUser = async ({ name }) => {
  const { data } = await axiosInstance.post('/users', { name });
  return data?.user ?? data;
};

export const ensurePlanCookie = async ({ name }) => {
  const account = await getUserAccountStatus();
  if (account?.exists) {
    return { ...account, created: false };
  }
  if (!name) {
    return { ...account, created: false };
  }

  try {
    const user = await createLocalUser({ name });
    return { ...user, exists: true, created: true };
  } catch (error) {
    if (error?.response?.status !== 409) throw error;
    const latestAccount = await getUserAccountStatus();
    if (!latestAccount?.exists) throw error;
    return { ...latestAccount, created: false };
  }
};

export const syncPlanCookie = async (profile = readStoredProfile()) => {
  return ensurePlanCookie(profile);
};

export const ensureLocalUser = ensurePlanCookie;

export const updateUsername = async (username) => {
  const { data } = await axiosInstance.patch('/users/username', { username });
  return data;
};
