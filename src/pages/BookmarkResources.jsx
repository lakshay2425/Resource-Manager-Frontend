import { useState, useEffect } from 'react';
import { Bookmark, AlertCircle, RefreshCw, ArrowRight, Loader2 } from 'lucide-react';
import BookmarkCard from "../components/BookmarkCard.jsx";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utilis/Axios.jsx';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/bookmarks');
      setBookmarks(response.data.bookMarkedResouces);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);

      if (error.response) {
        if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(error.response.data?.message || 'Failed to load bookmarks.');
        }
      } else if (error.request) {
        setError('Network error. Please check your internet connection.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = (resourceId) => {
    setBookmarks(prev => prev.filter(b => {
      const resource = b.resourceId || b;
      return resource._id !== resourceId;
    }));
  };

  const handleRetry = () => {
    fetchBookmarks();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-slate-700 animate-spin mb-4" />
            <p className="text-stone-600">Loading your bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-b border-stone-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
              My Bookmarks
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-white rounded-xl border border-red-200 p-8 max-w-md w-full text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Something went wrong
              </h2>
              <p className="text-stone-600 text-sm mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="btn-primary w-full"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (bookmarks.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-b border-stone-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
              My Bookmarks
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white rounded-xl border border-stone-200 p-8 sm:p-12 max-w-lg w-full text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="w-8 h-8 text-stone-400" />
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                No bookmarks yet
              </h2>
              <p className="text-stone-600 mb-6 text-sm leading-relaxed">
                Start building your collection of valuable resources. Browse through available resources and save the ones you find useful.
              </p>
              <button
                onClick={() => navigate("/publicResources")}
                className="btn-primary"
              >
                <span>Browse Resources</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Content with Bookmarks
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
                My Bookmarks
              </h1>
              <p className="text-stone-600 mt-1">Your saved resources in one place</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-slate-800 rounded-full">
              <Bookmark className="w-4 h-4" fill="currentColor" />
              <span className="text-sm font-medium">
                {bookmarks.length} {bookmarks.length === 1 ? 'resource' : 'resources'} saved
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(bookmark => {
            if (!bookmark || !bookmark.resourceId) {
              return null;
            }

            return (
              <BookmarkCard
                key={bookmark._id}
                bookmark={bookmark}
                onRemoveBookmark={handleRemoveBookmark}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;