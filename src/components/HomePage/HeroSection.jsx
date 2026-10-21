import { ArrowRight, ExternalLink } from 'lucide-react';
import { useGoogleAuth } from "../../hooks/useGoogleOAuth.js"
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { buildInPublicCollection } from '../../utilis/navLinks.js';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { handleGoogleLogin } = useGoogleAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-radial-glow" />

      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-6 text-balance" style={{ fontFamily: 'var(--font-display)' }}>
            Capture, organize, and
            <span className="block mt-2">
              <span className="text-amber-500">find</span> your resources
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Save links and resources in one place. Organize them with collections and tags,
            find them when you need them, and share selected resources or collections publicly.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 text-sm text-stone-500">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Collections
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Tags for filtering
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Instant search
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => isAuthenticated ? navigate("/createResource") : handleGoogleLogin()}
              className="btn-primary group"
            >
              {isAuthenticated ? "Add your first resource" : "Start organizing for free"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/publicResources")}
              className="btn-secondary group"
            >
              <ExternalLink className="w-4 h-4" />
              Browse community resources
            </button>
          </div>

          <p className="mt-5">
            <Link
              to={buildInPublicCollection.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              {buildInPublicCollection.heroLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
