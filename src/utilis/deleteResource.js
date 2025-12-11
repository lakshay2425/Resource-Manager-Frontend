import axiosInstance from "./Axios.jsx";
import toast from "react-hot-toast";
export const handleDeleteResource = async (setResources, resourceToDelete, setIsDeleting, setShowDeleteModal, setResourceToDelete) => {
  if (!resourceToDelete) return;

  try {
    setIsDeleting(true);
    await axiosInstance.delete(`/resources/${resourceToDelete._id}`);
    setResources(prevResources => prevResources.filter(resource => resource._id !== resourceToDelete._id));
    toast.success('Resource deleted successfully');
    setShowDeleteModal(false);
    setResourceToDelete(null);
  } catch (error) {
    console.error('Error deleting resource:', error);
    toast.error('Failed to delete resource. Please try again.');
  } finally {
    setIsDeleting(false);
  }
};