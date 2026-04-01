import { useState } from "react";
import { ExternalLink, User, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { getCategoryColor } from "../utilis/getCategoryColor.js";
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import axiosInstance from "../utilis/Axios.jsx";
import toast from "react-hot-toast";

const BookmarkCard = ({ bookmark, onRemoveBookmark }) => {
  const resource = bookmark?.resourceId;
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRemoveBookmark = async () => {
    try {
      setIsRemoving(true);

      await axiosInstance.delete(`/bookmarks/${bookmark._id}`).then(() => toast.success("Bookmark removed successfully")).catch((err) => {
        console.error("Failed to remove resource from bookmark list");
        if (err.status === 403) {
          toast.error("You're not authorized to perform this action")
        } else if (err.status == 404) {
          toast.error("Resource not found")
        } else {
          toast.error("Failed to remove bookmark")
        }
      });

      if (onRemoveBookmark) {
        onRemoveBookmark(resource._id);
      }

      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('Failed to remove bookmark. Please try again.');
      setIsRemoving(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!isRemoving) {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {/* Resource Card */}
      <article className="group relative bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-lg p-5 sm:p-6">
        {/* Resource Content */}
        <div>
          {/* Category Badge and Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className="tag tag-primary">
              <CategoryIcon category={resource?.tags?.[0] || 'general'} className="w-3 h-3" />
              <span>{resource?.tags?.[0] || 'Resource'}</span>
            </span>
            {resource?.tags && resource.tags.length > 1 && (
              <span className="text-xs text-stone-500">
                +{resource.tags.length - 1} more
              </span>
            )}
          </div>

          {/* Resource Name */}
          <h3 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-slate-700 transition-colors leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {resource?.name || 'Untitled Resource'}
          </h3>

          {/* Resource Description */}
          <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {resource?.description || 'No description available'}
          </p>

          {/* All Tags */}
          {resource?.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs hover:bg-amber-50 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <CategoryIcon category={tag} className="w-3 h-3" />
                  <span>#{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Owner Information and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-stone-100 gap-3">
            {/* Resource Owner */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-stone-500">Shared by</p>
                <p className="text-sm font-medium text-stone-800 truncate" title={resource?.email}>
                  {resource?.email || 'Unknown'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Remove Bookmark Button */}
              <button
                onClick={openDeleteModal}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove from bookmarks"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Visit Resource Button */}
              <a
                href={resource?.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200 group/link"
              >
                <span>Visit</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Remove Bookmark
              </h3>
              <p className="text-stone-600 text-sm">
                Are you sure you want to remove <span className="font-medium text-stone-900">"{resource?.name}"</span> from your bookmarks?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isRemoving}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveBookmark}
                disabled={isRemoving}
                className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Removing...</span>
                  </>
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