import axiosInstance from "./Axios";
import toast from "react-hot-toast";

// Handle bookmark toggle
export const handleBookmark = async (resourceId, setIsAnimating, setIsBookmarked, isBookmarked, onBookmarkChange) => {
  // e.stopPropagation(); // Prevent triggering parent clicks

  // Optimistic UI update
  setIsBookmarked(!isBookmarked);
  setIsAnimating(true);

  setTimeout(() => setIsAnimating(false), 600); // Animation duration

  try {
    if (isBookmarked) {
      const response = await axiosInstance.delete(`/bookmarks/${resourceId}`);
      if (response.status === 200) {
        toast.success("Resource removed from bookmarked successfully");
      }
    } else {
      const response = await axiosInstance.post("/bookmarks", {
        id: resourceId
      })
      if (response.status === 201) {
        toast.success("Resource bookmarked successfully");
      }
    }
    // Notify parent component (optional)
    if (onBookmarkChange) {
      onBookmarkChange(resourceId, !isBookmarked);
    }
  } catch (error) {
    console.error(error);
    if (error?.status === 404) return toast.error('Resource is already bookmarked');
    console.error(error.message, "Error in updating the bookmark status");
    toast.error("Failed to update resource bookmark status")
  }
};