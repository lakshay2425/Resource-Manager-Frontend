import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Layers, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div
            className="text-[8rem] font-bold text-stone-200 leading-none select-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-700" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-stone-900 mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Resource Not Found
          </h1>
          <p className="text-stone-600 leading-relaxed">
            The resource you're looking for might have been moved, deleted, or set to private.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full btn-primary"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => navigate('/publicResources')}
            className="w-full btn-secondary"
          >
            <Layers className="w-4 h-4" />
            <span>Browse Public Resources</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-10 pt-8 border-t border-stone-200">
          <p className="text-sm text-stone-500">
            Need help? Check if you have permission to access this resource or try again later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;