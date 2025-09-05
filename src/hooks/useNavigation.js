import { useNavigate, useLocation } from "react-router-dom";

const useSectionNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToSection = (sectionId) => {
    if (location.pathname === '/') {
      // On home page - just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On different page - navigate to home with hash
      navigate(`/#${sectionId}`);
    }
  };

  return navigateToSection;
};

export default useSectionNavigation;