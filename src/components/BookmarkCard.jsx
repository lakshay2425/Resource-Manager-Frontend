import { useState } from "react";
import { Bookmark, ArrowUpRight, User, XCircle } from "lucide-react";
import { getCategoryColor } from "../utilis/getCategoryColor.js";
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import axiosInstance from "../utilis/Axios.jsx";

const BookmarkCard = ({ bookmark, onRemoveBookmark }) => {
  // We're working with the bookmark object which contains the resource details
  const resource = bookmark.resourceId || bookmark;
  
  const [isRemoving, setIsRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Handle removing the bookmark
  const handleRemoveBookmark = async () => {
    // Show confirmation dialog first
    if (!showRemoveConfirm) {
      setShowRemoveConfirm(true);
      return;
    }

    try {
      setIsRemoving(true);
      
      // Call your API to remove the bookmark
      await axiosInstance.delete(`/bookmarks/${bookmark._id}`);
      
      // Notify parent component to update the list
      if (onRemoveBookmark) {
        onRemoveBookmark(resource._id);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      // You might want to show a toast notification here
      alert('Failed to remove bookmark. Please try again.');
    } finally {
      setIsRemoving(false);
      setShowRemoveConfirm(false);
    }
  };

  // Cancel the removal confirmation
  const handleCancelRemove = () => {
    setShowRemoveConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative p-4 sm:p-6">
      {/* Bookmark Badge - indicates this is a bookmarked resource */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <div className="flex items-center space-x-1 bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
          <Bookmark className="w-3 h-3" fill="currentColor" />
          <span className="hidden sm:inline">Saved</span>
        </div>
      </div>

      {/* Resource Content */}
      <div className="pt-8 sm:pt-6">
        {/* Category Badge and Tags */}
        <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
          <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-medium border flex items-center space-x-1 ${getCategoryColor(resource.tags?.[0] || 'general')}`}>
            <CategoryIcon category={resource.tags?.[0] || 'general'} className="w-3 h-3" />
            <span className="hidden xs:inline">{resource.tags?.[0] || 'Resource'}</span>
          </span>
          {resource.tags && resource.tags.length > 1 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              +{resource.tags.length - 1} more
            </span>
          )}
        </div>

        {/* Resource Name */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">
          {resource.name}
        </h3>

        {/* Resource Description */}
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
          {resource.description}
        </p>

        {/* All Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {resource.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md sm:rounded-lg text-xs hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer flex items-center space-x-1"
              >
                <CategoryIcon category={tag} className="w-3 h-3" />
                <span>#{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Owner Information and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-50 space-y-3 sm:space-y-0">
          {/* Resource Owner */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Created by</p>
              <p className="text-xs sm:text-sm font-medium text-gray-800 truncate" title={resource.email}>
                {resource.email || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between sm:justify-end space-x-2">
            {/* Remove Bookmark Button */}
            {!showRemoveConfirm ? (
              <button
                onClick={handleRemoveBookmark}
                disabled={isRemoving}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove from bookmarks"
              >
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleCancelRemove}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveBookmark}
                  disabled={isRemoving}
                  className="px-2 py-1 text-xs text-white bg-red-500 hover:bg-red-600 rounded transition-colors disabled:opacity-50"
                >
                  {isRemoving ? 'Removing...' : 'Confirm'}
                </button>
              </div>
            )}

            {/* Visit Resource Button */}
            <a
              href={resource.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 flex-shrink-0"
            >
              <span>Visit</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;