import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, FolderOpen } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-slate-200 dark:text-slate-700 select-none">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            Resource Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The resource you're looking for might have been moved, deleted, or set to private.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
          
          <button
            onClick={() => navigate('/publicResources')}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-sm"
          >
            <FolderOpen className="w-4 h-4" />
            Browse Public Resources
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-medium py-2 px-4 rounded-lg transition-colors duration-200 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Need help? Check if you have permission to access this resource or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;