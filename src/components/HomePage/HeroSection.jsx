import {
  Lock,
  Unlock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useGoogleAuth } from "../../hooks/useGoogleOAuth.js"
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { handleGoogleLogin } = useGoogleAuth();

  const sampleResources = [
    {
      title: "Design System Guide",
      description: "Component library documentation",
      isPublic: false,
      accentColor: "bg-slate-500",
    },
    {
      title: "React Performance Tips",
      description: "Optimization techniques",
      isPublic: true,
      username: "lakshay",
      accentColor: "bg-amber-500",
    },
    {
      title: "API Reference",
      description: "Backend integration docs",
      isPublic: true,
      username: "devnotes",
      accentColor: "bg-rose-500",
    },
    {
      title: "Personal Bookmarks",
      description: "Saved for later reading",
      isPublic: false,
      accentColor: "bg-indigo-400",
    },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-radial-glow" />

      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-slate-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-6 text-balance" style={{ fontFamily: 'var(--font-display)' }}>
              Capture, organize, and
              <span className="block mt-2">
                <span className="text-amber-500">find</span> your resources
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Save links and resources in one place. Organize them with collections and tags,
              find them when you need them, and share selected resources or collections publicly.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 mb-10 text-sm text-stone-500">
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="relative pb-8">
                <div className="absolute inset-4 bg-gradient-to-br from-slate-500/20 to-amber-500/10 rounded-3xl blur-2xl" />

                <div className="relative grid grid-cols-2 gap-4 p-2">
                  {sampleResources.map((resource, index) => (
                    <div
                      key={index}
                      className="card p-4 opacity-0 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1 + 0.3}s`, animationFillMode: 'forwards' }}
                    >
                      <div className={`w-8 h-1 ${resource.accentColor} rounded-full mb-3`} />

                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-stone-800 leading-tight pr-2">
                          {resource.title}
                        </h3>
                        {resource.isPublic ? (
                          <Unlock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-xs text-stone-500 leading-relaxed">
                        {resource.description}
                      </p>
                      {resource.isPublic && resource.username && (
                        <p className="text-xs text-stone-400 mt-2">@{resource.username}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative flex justify-center mt-4">
                  <div className="card-glass px-6 py-3 flex items-center gap-5 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                    <div className="text-center">
                      <div className="text-lg font-bold text-stone-800">Collections</div>
                      <div className="text-xs text-stone-500">Organize by topic</div>
                    </div>
                    <div className="w-px h-8 bg-stone-200" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-500">Tags</div>
                      <div className="text-xs text-stone-500">Filter & find</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
