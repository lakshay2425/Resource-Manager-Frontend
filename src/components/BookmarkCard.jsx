import { useState } from "react";
import { ArrowUpRight, User, Trash2, AlertTriangle, X } from "lucide-react";
import { getCategoryColor } from "../utilis/getCategoryColor.js";
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import axiosInstance from "../utilis/Axios.jsx";
import toast from "react-hot-toast";

const BookmarkCard = ({bookmark, onRemoveBookmark }) => {
  // We're working with the bookmark object which contains the resource details
  const resource = bookmark?.resourceId;
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Handle removing the bookmark
  const handleRemoveBookmark = async () => {
    try {
      setIsRemoving(true);
      
      // Call your API to remove the bookmark
      await axiosInstance.delete(`/bookmarks/${resource._id}`).then(()=> toast.success("Resources removed successfully")).catch((err)=>{
        console.error("Failed to remove resource from bookmark list");
        if(err.status === 403){
          toast.error("You're not authorized to perform this action")
        }else if(err.status == 404){
          toast.error("Resource not found")
        }else{
          toast.error("Failed to remove resource from bookmark")
        }
      });
      
      // Notify parent component to update the list
      if (onRemoveBookmark) {
        onRemoveBookmark(resource._id);
      }
      
      // Close the modal after successful deletion
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      // You might want to show a toast notification here
      alert('Failed to remove bookmark. Please try again.');
      setIsRemoving(false);
    }
  };

  // Open the confirmation modal
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // Close the confirmation modal
  const closeDeleteModal = () => {
    if (!isRemoving) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* The Resource Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative p-4 sm:p-6">
        {/* Resource Content */}
        <div>
          {/* Category Badge and Tags */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-medium border flex items-center space-x-1 ${getCategoryColor(resource?.tags?.[0] || 'general')}`}>
              <CategoryIcon category={resource?.tags?.[0] || 'general'} className="w-3 h-3" />
              <span className="hidden xs:inline">{resource?.tags?.[0] || 'Resource'}</span>
            </span>
            {resource?.tags && resource.tags.length > 1 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                +{resource.tags.length - 1} more
              </span>
            )}
          </div>

          {/* Resource Name */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">
            {resource?.name || 'Untitled Resource'}
          </h3>

          {/* Resource Description */}
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
            {resource?.description || 'No description available'}
          </p>

          {/* All Tags */}
          {resource?.tags && resource.tags.length > 0 && (
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
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Created by</p>
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate" title={resource?.email}>
                  {resource?.email || 'Unknown'}
                </p>
              </div>
            </div>

            {/* Action Buttons - Fixed spacing and layout for mobile */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Remove Bookmark Button */}
              <button
                onClick={openDeleteModal}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors group/delete flex-shrink-0"
                title="Remove from bookmarks"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/delete:scale-110 transition-transform duration-200" />
              </button>

              {/* Visit Resource Button */}
              <a
                href={resource?.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 sm:px-4 rounded-full text-xs sm:text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              >
                <span>Visit</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Appears as overlay when showDeleteModal is true */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeDeleteModal}
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
          >
            {/* Modal Header with Icon */}
            <div className="flex flex-col items-center text-center mb-6">
              {/* Warning Icon with gradient background */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              {/* Modal Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Remove Bookmark?
              </h3>
              
              {/* Modal Description */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-gray-900">"{resource?.name}"</span> from your bookmarks? This action cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Cancel Button - styled to match your design system */}
              <button
                onClick={closeDeleteModal}
                disabled={isRemoving}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              {/* Confirm Delete Button - uses red gradient to indicate destructive action */}
              <button
                onClick={handleRemoveBookmark}
                disabled={isRemoving}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/30 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isRemoving ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Removing...</span>
                  </span>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookmarkCard;