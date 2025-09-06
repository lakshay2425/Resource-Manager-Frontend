import { useLoading } from "../hooks/useLoading";
import LoadingSpinner from "./LoadingBar";



const LoadingScreen = ({ children }) => {
    const { isLoading } = useLoading();
    return (
        <>
            {isLoading ? (
                <div className="fixed inset-0 z-50">
                    <LoadingSpinner  message={"Loading..."}/>
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default LoadingScreen;
