import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import LoadingBar from "../components/LoadingBar";


const RenderProtectedRoute = ({condition,renderPage,fallback,errorMessage, devMode=false}) => {
  const checkFailed = () => {
    toast.error(errorMessage);
    if (!condition) {
      return <Navigate to={fallback} replace />;
    }
  };
    const {isLoading} = useContext(AuthContext);
    if(isLoading)   return <LoadingBar/>

  return <div>{devMode ? renderPage : condition ? renderPage : checkFailed()}</div>;
};

export default RenderProtectedRoute;
