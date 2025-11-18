import { useState, useEffect } from 'react';
import { Bookmark, AlertCircle, RefreshCw } from 'lucide-react';
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
      
      // Enhanced error handling with specific error messages
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(error.response.data?.message || 'Failed to load bookmarks.');
        }
      } else if (error.request) {
        // Request made but no response received
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
    // Remove the bookmark from state after successful deletion
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" />
            <h1 className="text-2xl sm:text-3xl font-bold">My Bookmarks</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" />
            <h1 className="text-2xl sm:text-3xl font-bold">My Bookmarks</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 max-w-md w-full">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-red-800 text-center mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-red-600 text-center mb-6 text-sm sm:text-base">{error}</p>
              <button
                onClick={handleRetry}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" />
            <h1 className="text-2xl sm:text-3xl font-bold">My Bookmarks</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center shadow-lg border border-white/30">
              <div className="relative inline-block mb-6">
                <Bookmark className="w-16 h-16 sm:w-20 sm:h-20 text-purple-200" />
                <div className="absolute -top-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl font-bold">0</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                No Resources Bookmarked Yet
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                Start building your collection of valuable resources! Browse through available resources and bookmark the ones you find useful.
              </p>
              <button
                onClick={() => navigate("/resources")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2 text-sm sm:text-base"
              >
                <span>Explore Resources</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Content with Bookmarks
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                My Bookmarks
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                Your saved resources in one place
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 sm:px-4 shadow-sm border border-gray-200">
            <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" fill="currentColor" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {bookmarks.length} {bookmarks.length === 1 ? 'resource' : 'resources'}
            </span>
          </div>
        </div>
        
        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {bookmarks.map(bookmark => {
            // Ensure we have valid data before rendering
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