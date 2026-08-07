import { useMutation } from '@tanstack/react-query';
import { ensureLocalUser } from '../api/usersApi';

export const useEnsureLocalUser = () => {
  return useMutation({
    mutationFn: ({ name, username }) => ensureLocalUser({ name, username }),
  });
};
