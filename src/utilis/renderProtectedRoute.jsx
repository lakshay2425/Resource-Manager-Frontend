import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";


const RenderProtectedRoute = ({condition,renderPage,fallback,errorMessage, devMode=false}) => {
  const checkFailed = () => {
    toast.error(errorMessage);
    if (!condition) {
      return <Navigate to={fallback} />;
    }
  };

  return <div>{devMode ? renderPage : condition ? renderPage : checkFailed()}</div>;
};

export default RenderProtectedRoute;
