import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocalStorageState } from './useLocalStorage.js';
import { ensureLocalUser } from '../api/usersApi.js';

export const useGoogleAuth = () => {
  const { setIsAuthenticated, setGmail, setName, setUsername } = useContext(AuthContext);
  const authService = import.meta.env.VITE_AUTH_URL;
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useLocalStorageState('userInfo', null);

  const googleResponse = async (authResult) => {
    try {
      let result;
      const businessName = 'Resource Manager';
      if (authResult['code']) {
        result = await axios.get(
          `${authService}/auth/google/callback?code=${authResult['code']}&businessName=${businessName}`,
          {
            withCredentials: true,
          }
        );
      }
      if (result.status == 200 || result.status == 201) {
        const { name, username, email, profileImage } = result.data.userInfo;

        setUser({
          profilePic: profileImage,
          username,
          name,
        });
        setGmail(email);
        setName(name ?? '');
        setUsername(username ?? '');
        setIsAuthenticated(true);

        try {
          await ensureLocalUser({ name, username });
        } catch (signupError) {
          const status = signupError?.response?.status;
          const message = signupError?.response?.data?.message ?? '';
          if (status === 409 && message.toLowerCase().includes('username')) {
            toast.error('Username already taken. Please contact support.');
          } else if (status !== 409) {
            console.error('Local user signup failed:', signupError);
            toast.error('Could not finish account setup. Some features may not work.');
          }
        }

        toast.success('LoggedIn Successfully');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  const handleGoogleError = (error) => {
    if (error.error === 'popup_closed_by_user' || error.error === 'access_denied') {
      toast.error('Account selection canceled.');
    } else {
      console.error('Google Login Error:', error);
      toast.error('Google login failed.');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: handleGoogleError,
    flow: 'auth-code',
  });

  return { handleGoogleLogin };
};
