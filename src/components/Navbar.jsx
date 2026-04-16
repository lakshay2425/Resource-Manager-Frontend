import { useState, useRef, useEffect, useContext } from 'react';
import { Layers, Menu, X, User, LogOut, Home, Bookmark, ChevronDown, PlusCircle, ExternalLink } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useGoogleAuth } from "../hooks/useGoogleOAuth.js";
import { useLocalStorageState } from '../hooks/useLocalStorage.js';
import useSectionNavigation from '../hooks/useNavigation.js';
import profileImage from "./profileImagePlaceholder.png"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const [user, setUser] = useLocalStorageState("userInfo", null);
  const { setIsAuthenticated, isAuthenticated, setGmail, gmail } = useContext(AuthContext);
  const { handleGoogleLogin } = useGoogleAuth();
  const navigateToSection = useSectionNavigation();
  const location = useLocation();

  const authService = import.meta.env.VITE_AUTH_URL;
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    const response = await axios.post(`${authService}/users/logout`, null, {
      withCredentials: true
    });
    if (response.status === 200) {
      setUser(null);
      setIsAuthenticated(false);
      setGmail("");
      navigate("/")
      toast.success("Logged out successfully");
      setIsProfileOpen(false);
    }
  };

  const navigationLinks = [
    {
      href: '/publicResources',
      label: 'Explore',
      icon: Home,
      description: 'Browse public resources'
    },
    {
      href: '/resources',
      label: 'My Resources',
      icon: Layers,
      description: 'View and manage your resources'
    },
    {
      href: '/bookmarks',
      label: 'Saved',
      icon: Bookmark,
      description: 'View your saved bookmarks'
    },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/50'
      : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="relative w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
              ResourceHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  const isActive = isActivePath(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-amber-50 text-slate-800'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      title={link.description}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* Create Resource Button */}
                <Link
                  to="/createResource"
                  className="flex items-center gap-2 px-4 py-2 ml-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Resource</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-3" ref={profileRef}>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 ring-2 ring-white shadow-sm">
                      {user?.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-amber-100">
                          <User className="w-4 h-4 text-slate-700" />
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1 animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-sm font-medium text-stone-900">{user?.name || "Guest"}</p>
                        <p className="text-xs text-stone-500 truncate">{gmail}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Logged Out State */
              <>
                <button
                  onClick={() => navigateToSection("features")}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => navigateToSection("why-us")}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Why ResourceHub
                </button>
                <Link
                  to="/publicResources"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Explore</span>
                </Link>
                <button
                  onClick={() => handleGoogleLogin()}
                  className="ml-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-stone-600" /> : <Menu className="w-6 h-6 text-stone-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg animate-fade-in-up">
            <div className="px-4 py-4 space-y-1">
              {isAuthenticated ? (
                <>
                  {navigationLinks.map((link) => {
                    const IconComponent = link.icon;
                    const isActive = isActivePath(link.href);
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                          ? 'bg-amber-50 text-slate-800'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                          }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}

                  <Link
                    to="/createResource"
                    className="flex items-center gap-3 px-4 py-3 bg-amber-50 text-slate-800 rounded-lg text-sm font-medium"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Resource</span>
                  </Link>

                  {/* Mobile Profile Section */}
                  <div className="pt-3 mt-3 border-t border-stone-100">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200">
                        {user?.profilePic ? (
                          <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <img src={profileImage} alt="Default Profile" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{user?.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full rounded-lg"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigateToSection("features");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => {
                      navigateToSection("why-us");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    Why ResourceHub
                  </button>
                  <Link
                    to="/publicResources"
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Explore Resources
                  </Link>
                  <button
                    onClick={() => handleGoogleLogin()}
                    className="w-full mt-2 px-5 py-3 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
