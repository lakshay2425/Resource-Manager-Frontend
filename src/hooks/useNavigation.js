import { useNavigate, useLocation } from "react-router-dom";

const useSectionNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };


  const navigateToSection = (sectionId) => {
    if (location.pathname === '/') {
      scrollToSection(sectionId)
    } else {
      navigate(`/`);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  return navigateToSection;
};

export default useSectionNavigation;