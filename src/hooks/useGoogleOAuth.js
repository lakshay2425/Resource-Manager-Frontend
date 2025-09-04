import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext.jsx";
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLocalStorageState } from './useLocalStorage.js';

export const useGoogleAuth = () => {
  const { setIsAuthenticated, setGmail } = useContext(AuthContext);
  const authService = import.meta.env.VITE_AUTH_URL;
  const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useLocalStorageState("userInfo", null);

  const googleResponse = async (authResult) => {
    try {
      let result;
      const businessName = "Resource Manager"
      if (authResult["code"]) {
        result = await axios.get(
          `${authService}/auth/google/callback?code=${authResult["code"]}&businessName=${businessName}`,
          {
            withCredentials: true
          }
        );
      }
      if (result.status == 200 || result.status == 201) {
        setUser({
          profilePic: result.data.userInfo.profileImage,
          username: result.data.userInfo.username,
          name: result.data.userInfo.name
        })
        setGmail(result.data.userInfo.email);
        toast.success("LoggedIn Successfully");
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  const handleGoogleError = (error) => {
    if (
      error.error === "popup_closed_by_user" ||
      error.error === "access_denied"
    ) {
      toast.error("Account selection canceled.");
    } else {
      console.log("Google Login Error:", error);
      toast.error("Google login failed.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  return { handleGoogleLogin };
};