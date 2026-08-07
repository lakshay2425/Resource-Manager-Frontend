import { useState, useEffect, useContext, } from 'react';
import { Search, Globe, X, Grid, List, Loader2 } from 'lucide-react';
import axiosInstance from "../utilis/Axios.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import ResourceCard from "../components/ResourceCard.jsx";
import { usePageSeo } from '../hooks/usePageSeo.js';
import { PUBLIC_ROUTES } from '../utilis/seo.js';


export default function PublicResourcesPage() {
  usePageSeo(PUBLIC_ROUTES.publicResources);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useContext(AuthContext);
  const [bookMarkedResourcesId, setBookMarkedResourcesId] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/resources/publicResources");
        setResources(response.data.data || []);
        setFilteredResources(response.data.data || []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources([]);
        setFilteredResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique categories from resources
  const categories = ['All', ...new Set(resources.flatMap(resource => resource.tags || []))];

  // Handle bookmark change - update the local state when bookmark status changes
  const handleBookmarkChange = (resourceId, isBookmarked) => {
    setBookMarkedResourcesId((prev) =>
      isBookmarked
        ? prev.includes(resourceId) ? prev : [...prev, resourceId]
        : prev.filter((id) => id !== resourceId)
    );
    setResources(prev =>
      prev.map(r =>
        r._id === resourceId ? { ...r, isBookmarked } : r
      )
    );
    setFilteredResources(prev =>
      prev.map(r =>
        r._id === resourceId ? { ...r, isBookmarked } : r
      )
    );
  };

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

    if (isAuthenticated) getBookMarkedResourcesId();
  }, [isAuthenticated]);

  // Filter and sort resources
  useEffect(() => {
    let filtered = resources.filter(resource => {
      const tags = resource.tags || [];
      const description = resource.description || '';

      const matchesSearch = searchTerm === '' ||
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' ||
        tags.includes(selectedCategory);

      return matchesSearch && matchesCategory;
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

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedCategory, sortBy]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-slate-700 animate-spin mb-4" />
            <p className="text-stone-600">Loading resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
                Community Resources
              </h1>
              <p className="text-stone-600 mt-1">
                Discover resources shared by the community
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-slate-800 rounded-full">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{resources.length} Public Resources</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search resources, descriptions, or tags..."
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

        {/* Active Filters Info */}
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
          <div className={viewMode === 'grid'
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
            : "space-y-4"
          }>
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                bookMarkedResourcesId={bookMarkedResourcesId}
                isListView={viewMode === 'list'}
                onBookmarkChange={handleBookmarkChange}
                showBookmark={isAuthenticated}
                titleAsLink
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              No resources found
            </h3>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'All'
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "No resources are available at the moment."
              }
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}