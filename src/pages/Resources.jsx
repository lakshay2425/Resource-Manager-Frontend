// import LoadingBar from "../components/LoadingBar.jsx";
import { useState, useEffect, useMemo, useContext } from 'react';
import { Search,BookmarkPlus,Globe,X,Bookmark,ArrowUpRight, Edit3, Trash2,Grid,List,Lock,Plus,} from 'lucide-react';
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import axiosInstance from "../utilis/Axios.jsx";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import { handleDeleteResource } from "../utilis/deleteResource.js";
import { getCategoryColor } from "../utilis/getCategoryColor.js";
import { getInitials } from "../utilis/getInitials.js";
import { handleBookmark } from "../utilis/handleBookmark.js";
// import toast from "react-hot-toast";

export default function AllResourcesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // eslint-disable-next-line no-unused-vars
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all'); // all, private, public
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { gmail } = useContext(AuthContext);

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // setIsLoading(true);
        const response = await axiosInstance.get(`/resources`, {
          withCredentials: true
        });
        setResources(response.data.data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [gmail, setIsLoading]);

  // Handle bookmark change
  const handleBookmarkChange = (resourceId, isBookmarked) => {
    // Update local state
    setResources(prev =>
      prev.map(r =>
        r._id === resourceId ? { ...r, isBookmarked } : r
      )
    );
  };

  
  // Open delete confirmation modal
  const openDeleteModal = (resource) => {
    setResourceToDelete(resource);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setResourceToDelete(null);
    }
  };

  // Get unique categories from resources
  const categories = ['All', ...new Set(resources.flatMap(resource => resource.tags))];

  // Filter and sort resources
  const filteredResourcesComputed = useMemo(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = searchTerm === '' ||
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' ||
        resource.tags.includes(selectedCategory);

      const matchesStatus = selectedStatus === 'All' ||
        resource.status.toLowerCase() === selectedStatus.toLowerCase();

      // Tab filtering - all resources are user's resources
      let matchesTab = true;
      if (activeTab === 'private') {
        matchesTab = resource.status === 'private';
      } else if (activeTab === 'public') {
        matchesTab = resource.status === 'public';
      }
      // 'all' tab shows all user resources

      return matchesSearch && matchesCategory && matchesStatus && matchesTab;
    });

    // Sort resources
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b._id.substring(0, 8), 16) - new Date(a._id.substring(0, 8), 16);
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [resources, searchTerm, selectedCategory, selectedStatus, sortBy, activeTab]);

  useEffect(() => {
    setFilteredResources(filteredResourcesComputed);
  }, [filteredResourcesComputed]);

  const getStats = () => {
    // All resources are user's resources since API only returns user's data
    const privateCount = resources.filter(r => r.status === 'private').length;
    const publicCount = resources.filter(r => r.status === 'public').length;
    const totalCount = resources.length;

    return { privateCount, publicCount, totalCount };
  };

  const stats = getStats();

  const ResourceCard = ({ resource, isListView = false , onBookmarkChange , setResources }) => {
      const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(resource.isBookmarked || false);
  const [isAnimating, setIsAnimating] = useState(false);


    return (
      <div className={`bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative ${
        isListView 
          ? 'flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 space-y-4 sm:space-y-0 sm:space-x-6' 
          : 'p-4 sm:p-6'
      }`}>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center space-x-2">
                  {/* Bookmark Button - Instagram Style */}
        <button
          onClick={()=> handleBookmark(resource._id, setIsAnimating, setIsBookmarked, isBookmarked, onBookmarkChange)}
          className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
            isBookmarked 
              ? 'bg-purple-50 text-purple-600' 
              : 'bg-gray-50 text-gray-400 hover:bg-purple-50 hover:text-purple-500'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
        >
          <Bookmark
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
              isAnimating ? 'scale-125' : 'scale-100'
            }`}
            fill={isBookmarked ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
          {resource.status === 'private' ? (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-2 py-1 rounded-full text-xs">
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Private</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs">
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">Public</span>
            </div>
          )}
        </div>

        {/* Resource Content */}
        <div className={`${isListView ? 'flex-1' : ''} ${isListView ? 'pt-6 sm:pt-0' : 'pt-8 sm:pt-6'}`}>
          <div className={`flex ${
            isListView 
              ? 'flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0' 
              : 'items-start justify-between mb-3 sm:mb-4'
          }`}>
            <div className={`${isListView ? 'flex-1 sm:pr-4' : ''}`}>
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-medium border flex items-center space-x-1 ${getCategoryColor(resource.tags[0])}`}>
                  <CategoryIcon category={resource.tags[0]} className="w-3 h-3" />
                  <span className="hidden xs:inline">{resource.tags[0]}</span>
                </span>
                {resource.tags.length > 1 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    +{resource.tags.length - 1} more
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors leading-tight">
                {resource.name}
              </h3>
              <p className={`text-gray-600 leading-relaxed text-sm sm:text-base ${
                isListView ? '' : 'mb-3 sm:mb-4'
              }`}>
                {resource.description}
              </p>
            </div>
          </div>

          {/* All Tags */}
          <div className={`flex flex-wrap gap-1 sm:gap-2 ${isListView ? 'mb-3' : 'mb-3 sm:mb-4'}`}>
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

          {/* User and Stats */}
          <div className={`flex ${
            isListView 
              ? 'flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4' 
              : 'flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-50 space-y-3 sm:space-y-0'
          }`}>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">{getInitials(resource.email)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-800">You</p>
                <p className="text-xs text-gray-500">
                  {resource.status === 'private' ? 'Private Resource' : 'Public Resource'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
              {/* Action Buttons */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/edit/${resource._id}`, { state: { resource } })}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors group/edit"
                  title="Edit Resource"
                >
                  <Edit3 className="w-4 h-4 transform group-hover/edit:scale-110 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => handleDeleteResource(resource, setResources, resourceToDelete, setIsDeleting, showDeleteModal, setResourceToDelete)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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

   // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center space-x-3 mb-6 sm:mb-8">
            <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="currentColor" />
            <h1 className="text-2xl sm:text-3xl font-bold">My Resources</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading your resources...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* {isLoading === true ? (
        <LoadingBar message={"Loading Your Resources..."} />
      ) : ( */}

<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  My Resources
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your private and public resources</p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 sm:px-4 shadow-sm border border-gray-200">
                  <BookmarkPlus className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{stats.totalCount} Total</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 sm:px-4 shadow-sm border border-gray-200">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{stats.privateCount} Private</span>
                </div>
                <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 sm:px-4 shadow-sm border border-gray-200">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{stats.publicCount} Public</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg sm:rounded-xl p-1 mt-4 sm:mt-6 w-full overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 sm:px-6 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${activeTab === 'all'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                All Resources ({stats.totalCount})
              </button>
              <button
                onClick={() => setActiveTab('private')}
                className={`px-4 py-2 sm:px-6 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${activeTab === 'private'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                Private ({stats.privateCount})
              </button>
              <button
                onClick={() => setActiveTab('public')}
                className={`px-4 py-2 sm:px-6 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${activeTab === 'public'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                Public ({stats.publicCount})
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search and Filters */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/30 shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your resources, descriptions, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Category Filter */}
                <div className="flex-1 sm:flex-none">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base min-w-[120px]"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base min-w-[140px]"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg sm:rounded-xl p-1 shadow-sm border border-gray-200 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 sm:flex-none p-2 rounded-md sm:rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-purple-500'
                      }`}
                  >
                    <Grid className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 sm:flex-none p-2 rounded-md sm:rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-purple-500'
                      }`}
                  >
                    <List className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {(searchTerm || selectedCategory !== 'All') && (
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg sm:rounded-xl p-4 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">
                    Found <strong>{filteredResources.length}</strong> resources
                    {searchTerm && <> for "<strong>{searchTerm}</strong>"</>}
                    {selectedCategory !== 'All' && <> in "<strong>{selectedCategory}</strong>"</>}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <span className="text-sm">Clear</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Resources Grid/List */}
          {filteredResources.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                : "space-y-4 sm:space-y-6"
            }>
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  isListView={viewMode === 'list'}
                  onBookmarkChange={handleBookmarkChange}
                  onDeleteClick={openDeleteModal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <BookmarkPlus className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">No resources found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4 sm:px-0">
                {activeTab === 'private'
                  ? "You haven't created any private resources yet. Start building your personal collection!"
                  : activeTab === 'public'
                    ? "You haven't made any resources public yet. Share your knowledge with the community!"
                    : searchTerm || selectedCategory !== 'All'
                      ? "No resources match your current filters. Try adjusting your search criteria."
                      : "You haven't created any resources yet. Start building your collection!"
                }
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => navigate("/createResource")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && resourceToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeDeleteModal}
        >
          {/* Modal Content */}
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Icon */}
            <div className="flex flex-col items-center text-center mb-6">
              {/* Warning Icon with gradient background */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              {/* Modal Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Delete Resource?
              </h3>
              
              {/* Modal Description */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Are you sure you want to permanently delete <span className="font-semibold text-gray-900">"{resourceToDelete.name}"</span>? This action cannot be undone and will remove the resource from your collection.
              </p>
            </div>

            {/* Resource Info Preview - Optional but helpful context */}
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="flex items-start space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getCategoryColor(resourceToDelete.tags?.[0] || 'general')}`}>
                  <CategoryIcon category={resourceToDelete.tags?.[0] || 'general'} className="w-3 h-3" />
                  <span>{resourceToDelete.tags?.[0] || 'Resource'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{resourceToDelete.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{resourceToDelete.description}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Cancel Button */}
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              {/* Confirm Delete Button */}
              <button
                onClick={handleDeleteResource}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/30 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Deleting...</span>
                  </span>
                ) : (
                  'Delete Resource'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* )} */}
    </>
  );
}






