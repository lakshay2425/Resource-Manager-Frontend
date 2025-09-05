import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component that scrolls the window to the top when the route changes
 */

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the pathname changes
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Use smooth scrolling for a better user experience
    });
  }, [pathname]);

  return null; 
};

export default ScrollToTop;