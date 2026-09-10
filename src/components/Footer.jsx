import { useContext } from 'react';
import { Layers, Github, Twitter, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSectionNavigation from '../hooks/useNavigation.js';
import { AuthContext } from '../context/AuthContext.jsx';
import {
  buildInPublicCollection,
  discoverLinks,
  myLibraryFooterLinks,
} from '../utilis/navLinks.js';

const Footer = () => {
  const navigateToSection = useSectionNavigation();
  const { isAuthenticated } = useContext(AuthContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div
            className={`grid md:grid-cols-2 gap-10 lg:gap-8 ${
              isAuthenticated ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
            }`}
          >
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ResourceHub
                </span>
              </Link>
              <p className="text-stone-400 max-w-md leading-relaxed mb-6">
                Stop losing valuable links in chat apps and scattered notes.
                Keep everything organized in one searchable, accessible place.
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/lakshay2425"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/lakshay2224"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:dev@lakshaymahajan.com"
                  className="w-10 h-10 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('features')}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('why-us')}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    Why ResourceHub
                  </button>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to={buildInPublicCollection.href}
                    className="text-stone-400 hover:text-white transition-colors text-sm"
                  >
                    {buildInPublicCollection.label}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Discover
              </h3>
              <ul className="space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-stone-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {isAuthenticated && (
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  My Library
                </h3>
                <ul className="space-y-3">
                  {myLibraryFooterLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-stone-400 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="py-6 border-t border-stone-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-stone-500 text-sm">
              © {currentYear} ResourceHub. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-stone-500 text-sm">
              Built with
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              for better resource management
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
