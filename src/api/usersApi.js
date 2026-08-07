import axiosInstance from '../utilis/Axios.jsx';

export const checkUserExists = async () => {
  const { data } = await axiosInstance.get('/users/exists');
  return data?.exists ?? false;
};

export const createLocalUser = async ({ name, username }) => {
  const { data } = await axiosInstance.post('/users', { name, username });
  return data?.user ?? data;
};

export const ensureLocalUser = async ({ name, username }) => {
  const exists = await checkUserExists();
  if (exists) {
    return { created: false };
  }
  const user = await createLocalUser({ name, username });
  return { created: true, user };
};
