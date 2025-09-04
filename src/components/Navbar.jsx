import { useState, useRef, useEffect , useContext} from 'react';
import { BookmarkPlus, Menu, X, User, LogOut,  Home, Bookmark, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useGoogleAuth } from "../hooks/useGoogleOAuth.js";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { setIsAuthenticated , isAuthenticated, setUser, user} = useContext(AuthContext);
  const {handleGoogleLogin} = useGoogleAuth();
  
  const authService = import.meta.env.VITE_AUTH_URL;
  const navigate = useNavigate();
  

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

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

  const handleLogout = async () => {
    const response = await axios.post(`${authService}/users/logout`);
    if(response.status === 204){
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully");
      setIsProfileOpen(false);
    }
  };

  const navigationLinks = [
    { href: '/publicResources', label: 'Public Resources', icon: Home },
    { href: '/resources', label: 'Resources', icon: Bookmark },
  ];

  return (
    <nav className="bg-white/85 backdrop-blur-xl border-b border-white/30 sticky top-0 z-50 shadow-lg shadow-purple-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div onClick={()=> navigate("/")} className="flex items-center space-x-3 cursor-pointer">
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
              <BookmarkPlus className="w-7 h-7 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
              ResourceHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-purple-50/50 group"
                    >
                      <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-purple-50/50 transition-all duration-200 group border border-transparent hover:border-purple-200/50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                      <User className="w-4 h-4 text-white" /><img src={user && user.profileImage} />
                    </div>
                    <span className="font-medium text-gray-700 group-hover:text-purple-600">{user && user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/10 border border-white/30 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100/50">
                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="border-t border-gray-100/50 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-all duration-200 w-full text-left group"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Logged Out State */
              <>
                <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Features</a>
                <a href="#why-us" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Why ResourceHub?</a>
                <a href="#discord" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Discord Bot</a>
                <button
                  onClick={() => handleGoogleLogin()}
                  className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg shadow-purple-500/20"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-200/50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/30 py-4 shadow-xl shadow-purple-500/5">
            <div className="flex flex-col space-y-3 px-4">
              {isAuthenticated ? (
                <>
                  {/* Mobile Navigation Links */}
                  {navigationLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-all duration-200 px-3 py-3 rounded-xl hover:bg-purple-50/50"
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile Profile Section */}
                  <div className="border-t border-gray-100/50 pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                        <img src={user.profileImage} alt="User Profile Image" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-red-600 hover:bg-red-50/50 transition-all duration-200 px-3 py-3 rounded-xl w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Mobile Logged Out State */
                <>
                  <Link to="#features" className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-3 rounded-xl hover:bg-purple-50/50">Features</Link>
                  <Link to="#why-us" className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-3 rounded-xl hover:bg-purple-50/50">Why ResourceHub?</Link>
                  <Link to="#discord" className="text-gray-700 hover:text-purple-600 transition-colors px-3 py-3 rounded-xl hover:bg-purple-50/50">Discord Bot</Link>
                  <button
                  onClick={() => handleGoogleLogin()}
                    className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-200 w-full font-medium shadow-lg shadow-purple-500/20 mt-4"
                  >
                    Sign Up
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