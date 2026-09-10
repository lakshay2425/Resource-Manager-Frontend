import { useState, useRef, useEffect, useContext } from 'react';
import {
  Layers,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  PlusCircle,
  ExternalLink,
  FolderOpen,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useGoogleAuth } from '../hooks/useGoogleOAuth.js';
import { useLocalStorageState } from '../hooks/useLocalStorage.js';
import useSectionNavigation from '../hooks/useNavigation.js';
import { useOfflineGuard } from '../hooks/useOfflineGuard.js';
import {
  discoverLinks,
  myLibraryLinks,
  isNavLinkActive,
  isNavGroupActive,
} from '../utilis/navLinks.js';
import profileImage from './profileImagePlaceholder.png';

function NavDropdown({ label, links, isOpen, onToggle, onClose, isActive, menuRef, pathname }) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-amber-50 text-slate-800'
            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1 animate-scale-in origin-top-left z-50">
          {links.map((link) => {
            const IconComponent = link.icon;
            const active = isNavLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-amber-50 text-slate-800'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
                title={link.description}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const libraryRef = useRef(null);
  const discoverRef = useRef(null);
  const [user, setUser] = useLocalStorageState('userInfo', null);
  const { setIsAuthenticated, isAuthenticated, setGmail, gmail } = useContext(AuthContext);
  const { handleGoogleLogin } = useGoogleAuth();
  const navigateToSection = useSectionNavigation();
  const location = useLocation();

  const authService = import.meta.env.VITE_AUTH_URL;
  const navigate = useNavigate();
  const { guardWrite, writeDisabled } = useOfflineGuard();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsLibraryOpen(false);
    setIsDiscoverOpen(false);
  };
  const toggleLibrary = () => {
    setIsLibraryOpen(!isLibraryOpen);
    setIsDiscoverOpen(false);
    setIsProfileOpen(false);
  };
  const toggleDiscover = () => {
    setIsDiscoverOpen(!isDiscoverOpen);
    setIsLibraryOpen(false);
    setIsProfileOpen(false);
  };

  const closeDropdowns = () => {
    setIsLibraryOpen(false);
    setIsDiscoverOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (libraryRef.current && !libraryRef.current.contains(event.target)) {
        setIsLibraryOpen(false);
      }
      if (discoverRef.current && !discoverRef.current.contains(event.target)) {
        setIsDiscoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsLibraryOpen(false);
    setIsDiscoverOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleLogout = async () => {
    if (!guardWrite()) return;

    const response = await axios.post(`${authService}/users/logout`, null, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setUser(null);
      setIsAuthenticated(false);
      setGmail('');
      navigate('/');
      toast.success('Logged out successfully');
      closeDropdowns();
    }
  };

  const isPricingActive = location.pathname === '/pricing';
  const libraryActive = isNavGroupActive(location.pathname, myLibraryLinks);
  const discoverActive = isNavGroupActive(location.pathname, discoverLinks);

  const navLinkClass = (active) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-amber-50 text-slate-800'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
    }`;

  const pricingLinkClass = (active) =>
    `block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-amber-50 text-slate-800'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
    }`;

  const renderMobileLinkGroup = (title, links) => (
    <div className="pt-2 first:pt-0">
      <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
        {title}
      </p>
      {links.map((link) => {
        const IconComponent = link.icon;
        const isActive = isNavLinkActive(location.pathname, link.href);
        return (
          <Link key={link.href} to={link.href} className={navLinkClass(isActive)}>
            <IconComponent className="w-5 h-5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span
              className="text-xl font-bold text-stone-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ResourceHub
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavDropdown
                  label="My Library"
                  links={myLibraryLinks}
                  isOpen={isLibraryOpen}
                  onToggle={toggleLibrary}
                  onClose={closeDropdowns}
                  isActive={libraryActive}
                  menuRef={libraryRef}
                  pathname={location.pathname}
                />
                <NavDropdown
                  label="Discover"
                  links={discoverLinks}
                  isOpen={isDiscoverOpen}
                  onToggle={toggleDiscover}
                  onClose={closeDropdowns}
                  isActive={discoverActive}
                  menuRef={discoverRef}
                  pathname={location.pathname}
                />
                <Link
                  to="/pricing"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isPricingActive
                      ? 'bg-amber-50 text-slate-800'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Pricing
                </Link>

                <Link
                  to="/createResource"
                  onClick={(e) => {
                    if (writeDisabled) {
                      e.preventDefault();
                      guardWrite();
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 ml-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                    writeDisabled
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-800 text-white hover:shadow-md'
                  }`}
                  aria-disabled={writeDisabled}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Resource</span>
                </Link>

                <div className="relative ml-3" ref={profileRef}>
                  <button
                    type="button"
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
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                        isProfileOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1 animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-sm font-medium text-stone-900">{user?.name || 'Guest'}</p>
                        <p className="text-xs text-stone-500 truncate">{gmail}</p>
                      </div>
                      <div className="py-1">
                        <button
                          type="button"
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
              <>
                <button
                  type="button"
                  onClick={() => navigateToSection('features')}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Features
                </button>
                <button
                  type="button"
                  onClick={() => navigateToSection('why-us')}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Why ResourceHub
                </button>
                <Link
                  to="/publicResources"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Community resources</span>
                </Link>
                <Link
                  to="/collections/public"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Public collections</span>
                </Link>
                <Link
                  to="/pricing"
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Pricing
                </Link>
                <button
                  type="button"
                  onClick={() => guardWrite(() => handleGoogleLogin())}
                  disabled={writeDisabled}
                  className="ml-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-800 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-stone-600" />
            ) : (
              <Menu className="w-6 h-6 text-stone-600" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone-200 shadow-lg animate-fade-in-up">
            <div className="px-4 py-4 space-y-1">
              {isAuthenticated ? (
                <>
                  {renderMobileLinkGroup('My Library', myLibraryLinks)}
                  {renderMobileLinkGroup('Discover', discoverLinks)}

                  <div className="pt-2">
                    <Link to="/pricing" className={pricingLinkClass(isPricingActive)}>
                      Pricing
                    </Link>
                  </div>

                  <Link
                    to="/createResource"
                    onClick={(e) => {
                      if (writeDisabled) {
                        e.preventDefault();
                        guardWrite();
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                      writeDisabled
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-amber-50 text-slate-800'
                    }`}
                    aria-disabled={writeDisabled}
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Resource</span>
                  </Link>

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
                      type="button"
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
                    type="button"
                    onClick={() => {
                      navigateToSection('features');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    Features
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigateToSection('why-us');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    Why ResourceHub
                  </button>
                  {renderMobileLinkGroup('Discover', discoverLinks)}
                  <Link to="/pricing" className={pricingLinkClass(isPricingActive)}>
                    Pricing
                  </Link>
                  <button
                    type="button"
                    onClick={() => guardWrite(() => handleGoogleLogin())}
                    disabled={writeDisabled}
                    className="w-full mt-2 px-5 py-3 bg-slate-700 hover:bg-slate-800 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all duration-200"
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
