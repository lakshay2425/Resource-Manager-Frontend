import axiosInstance from "./Axios.jsx";

export const handleDeleteResource = async (resourceId, setResources) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axiosInstance.delete(`/resources?id=${resourceId}`);
        setResources(prevResources => prevResources.filter(resource => resource._id !== resourceId));
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };