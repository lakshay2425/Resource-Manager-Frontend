import  { useState, useEffect } from "react";
import { LoadingContext } from "../hooks/useLoading";

// Adjust this value to control how long the loading screen appears (in milliseconds)
const LOADING_DURATION = 1000; // 1 seconds

export const LoadingProvider = ({
    children,
}) => {

    const [isLoading, setIsLoading] = useState(true);

    // This effect runs once when the component mounts
    useEffect(() => {
        // Loading screen Timer
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, LOADING_DURATION);

        // Clean up the timer if the component unmounts
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
