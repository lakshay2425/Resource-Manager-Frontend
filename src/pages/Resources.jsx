import { useState, useEffect, useMemo, useContext } from 'react';
import { Search, Layers, Globe, X, Bookmark, ExternalLink, Edit3, AlertTriangle, Trash2, Grid, List, Lock, Plus, Loader2 } from 'lucide-react';
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import axiosInstance from "../utilis/Axios.jsx";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext.jsx";
import { handleDeleteResource } from "../utilis/deleteResource.js";
import { getCategoryColor } from "../utilis/getCategoryColor.js";
import { getInitials } from "../utilis/getInitials.js";
import { handleBookmark } from "../utilis/handleBookmark.js";

export default function AllResourcesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  // eslint-disable-next-line no-unused-vars
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [bookMarkedResourcesId, setBookMarkedResourcesId] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { gmail } = useContext(AuthContext);

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/resources`);
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


  useEffect(() => {
    const getBookMarkedResourcesId = async () => {
      try {
        const response = await axiosInstance.get(`/bookmarks/ids`)
        const bookMakredResourceId = response.data.bookMarkedResouces.map(item => item.resourceId);
        setBookMarkedResourcesId(bookMakredResourceId || []);
      } catch (error) {
        console.error('Error fetching bookmarked resources IDs:', error);
      }
    }

    getBookMarkedResourcesId();
  }, []);


  // Handle bookmark change
  const handleBookmarkChange = (resourceId, isBookmarked) => {
    setResources(prev =>
      prev.map(r =>
        r._id === resourceId ? { ...r, isBookmarked } : r
      )
    );
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

      let matchesTab = true;
      if (activeTab === 'private') {
        matchesTab = resource.status === 'private';
      } else if (activeTab === 'public') {
        matchesTab = resource.status === 'public';
      }

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
    const privateCount = resources.filter(r => r.status === 'private').length;
    const publicCount = resources.filter(r => r.status === 'public').length;
    const totalCount = resources.length;

    return { privateCount, publicCount, totalCount };
  };

  const stats = getStats();

  const ResourceCard = ({ resource, isListView = false, onBookmarkChange, bookMarkedResourcesId }) => {
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(bookMarkedResourcesId.includes(resource._id) || false);
    const [isAnimating, setIsAnimating] = useState(false);


    return (
      <article className={`group relative bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-lg ${isListView
        ? 'flex flex-col sm:flex-row sm:items-center p-5 sm:p-6 space-y-4 sm:space-y-0 sm:space-x-6'
        : 'p-5 sm:p-6'
        }`}>

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => handleBookmark(resource._id, setIsAnimating, setIsBookmarked, bookMarkedResourcesId.includes(resource._id), onBookmarkChange)}
            className={`p-2 rounded-lg transition-all duration-200 ${isBookmarked
              ? 'bg-amber-50 text-slate-700'
              : 'bg-stone-100 text-stone-400 hover:bg-amber-50 hover:text-slate-700'
              }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}
              fill={isBookmarked ? 'currentColor' : 'none'}
              strokeWidth={2}
            />
          </button>

          {/* Status Badge */}
          {resource.status === 'private' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium">
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Private</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-slate-800 rounded-md text-xs font-medium">
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">Public</span>
            </span>
          )}
        </div>

        {/* Resource Content */}
        <div className={`${isListView ? 'flex-1' : ''} pr-32 sm:pr-36`}>
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="tag tag-primary">
              <CategoryIcon category={resource.tags[0]} className="w-3 h-3" />
              <span>{resource.tags[0]}</span>
            </span>
            {resource.tags.length > 1 && (
              <span className="text-xs text-stone-500">
                +{resource.tags.length - 1} more
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-stone-900 mb-2 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {resource.name}
          </h3>

          {/* Description */}
          <p className={`text-stone-600 text-sm leading-relaxed ${isListView ? '' : 'mb-4'}`}>
            {resource.description}
          </p>
        </div>

        {/* All Tags */}
        <div className={`flex flex-wrap gap-1.5 ${isListView ? 'mb-3' : 'mb-4'}`}>
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

        {/* User and Stats */}
        <div className={`flex ${isListView
          ? 'flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4'
          : 'flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-stone-100 space-y-3 sm:space-y-0'
          }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{getInitials(resource.email)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-800">You</p>
              <p className="text-xs text-stone-500">
                {resource.status === 'private' ? 'Private Resource' : 'Public Resource'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Action Buttons */}
            <button
              onClick={() => navigate(`/edit/${resource._id}`, { state: { resource } })}
              className="p-2 text-stone-400 hover:text-slate-700 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit Resource"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(true);
                setResourceToDelete(resource);
              }}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Visit Link */}
            <a
              href={resource.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200 group/link"
            >
              <span>Visit</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </article>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-slate-700 animate-spin mb-4" />
            <p className="text-stone-600">Loading your resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-stone-50">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
                  My Resources
                </h1>
                <p className="text-stone-600 mt-1">Manage your private and public resources</p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-100 rounded-lg">
                  <Layers className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-700">{stats.totalCount} Total</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-stone-100 rounded-lg">
                  <Lock className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-700">{stats.privateCount} Private</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
                  <Globe className="w-4 h-4 text-slate-700" />
                  <span className="text-sm font-medium text-slate-800">{stats.publicCount} Public</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-stone-100 rounded-lg p-1 mt-6 w-full sm:w-auto overflow-x-auto">
              {[
                { key: 'all', label: `All (${stats.totalCount})` },
                { key: 'private', label: `Private (${stats.privateCount})` },
                { key: 'public', label: `Public (${stats.publicCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex-shrink-0 ${activeTab === tab.key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-6 mb-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search your resources, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-12"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input sm:w-auto"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input sm:w-auto"
                >
                  <option value="recent">Most Recent</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-stone-100 rounded-lg p-1 sm:ml-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-slate-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {(searchTerm || selectedCategory !== 'All') && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-800">
                  <Search className="w-4 h-4" />
                  <span className="text-sm">
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
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-800 hover:bg-amber-100 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              </div>
            </div>
          )}

          {/* Resources Grid/List */}
          {filteredResources.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                  bookMarkedResourcesId={bookMarkedResourcesId}
                  isListView={viewMode === 'list'}
                  onBookmarkChange={handleBookmarkChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layers className="w-10 h-10 text-stone-400" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No resources found
              </h3>
              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                {activeTab === 'private'
                  ? "You haven't created any private resources yet. Start building your personal collection."
                  : activeTab === 'public'
                    ? "You haven't made any resources public yet. Share your knowledge with the community."
                    : searchTerm || selectedCategory !== 'All'
                      ? "No resources match your current filters. Try adjusting your search criteria."
                      : "You haven't created any resources yet. Start building your collection."
                }
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="btn-secondary"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => navigate("/createResource")}
                  className="btn-primary"
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
                Delete Resource
              </h3>
              <p className="text-stone-600 text-sm">
                Are you sure you want to permanently delete <span className="font-medium text-stone-900">"{resourceToDelete.name}"</span>? This action cannot be undone.
              </p>
            </div>

            {/* Resource Preview */}
            <div className="bg-stone-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className={`tag tag-primary`}>
                  <CategoryIcon category={resourceToDelete.tags?.[0] || 'general'} className="w-3 h-3" />
                  <span>{resourceToDelete.tags?.[0] || 'Resource'}</span>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{resourceToDelete.name}</p>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{resourceToDelete.description}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteResource(setResources, resourceToDelete, setIsDeleting, setShowDeleteModal, setResourceToDelete)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete Resource'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
