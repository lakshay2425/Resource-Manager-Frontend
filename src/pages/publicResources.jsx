import { getInitials } from "../utilis/getInitials.js";
import { getCategoryColor } from "../utilis/getCategoryColor.js"
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import { useState, useEffect, useContext, } from 'react';
import { Search,Globe,X,Grid,List, Bookmark, ChevronUp, ChevronDown} from 'lucide-react';
import axiosInstance from "../utilis/Axios.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { handleBookmark } from "../utilis/handleBookmark.js";


export default function PublicResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const {isAuthenticated} = useContext(AuthContext);

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
  const categories = ['All', ...new Set(resources.flatMap(resource => resource.tags))];

   // Handle bookmark change - update the local state when bookmark status changes
  const handleBookmarkChange = (resourceId, isBookmarked) => {
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

  // Filter and sort resources
  useEffect(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = searchTerm === '' ||
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' ||
        resource.tags.includes(selectedCategory);

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

const ResourceCard = ({ resource, isListView = false }) => {
    const [showAllTags, setShowAllTags] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(resource.isBookmarked || false);
    const [isAnimating, setIsAnimating] = useState(false);


    // Show only first 3 tags on mobile, all on larger screens
    const visibleTags = showAllTags ? resource.tags : resource.tags.slice(0, 3);
    const hasMoreTags = resource.tags.length > 3;

    return (
      <div className={`bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative ${isListView
          ? 'flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 space-y-4 sm:space-y-0 sm:space-x-6'
          : 'p-4 sm:p-6'
        }`}>
        
        {/* Bookmark Button - Only visible when authenticated */}
        {isAuthenticated && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <button
              onClick={()=> handleBookmark(resource._id, setIsAnimating,setIsBookmarked,isBookmarked,handleBookmarkChange)}
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
          </div>
        )}

        <div className={`${isListView ? 'flex-1' : ''} ${isAuthenticated ? 'pt-8 sm:pt-6' : ''}`}>
          <div className={`flex ${isListView
              ? 'flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'
              : 'items-start justify-between mb-3 sm:mb-4'
            }`}>
            <div className={`${isListView ? 'flex-1' : ''}`}>
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
              
              {/* Made title clickable with proper link */}
              <h3 className="text-lg sm:text-xl font-bold mb-2 leading-tight">
                <a 
                  href={resource.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 transition-colors cursor-pointer hover:decoration-purple-500 decoration-2 underline-offset-2"
                >
                  {resource.name}
                </a>
              </h3>
              
              <p className={`text-gray-600 leading-relaxed text-sm sm:text-base ${isListView ? '' : 'mb-3 sm:mb-4'
                }`}>
                {resource.description}
              </p>
            </div>
          </div>

          {/* All Tags */}
          <div className={`${isListView ? 'mb-3 sm:mb-3' : 'mb-3 sm:mb-4'}`}>
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
              {visibleTags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md sm:rounded-lg text-xs hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <CategoryIcon category={tag} className="w-3 h-3" />
                  <span>#{tag}</span>
                </span>
              ))}
            </div>

            {/* Show More/Less button for tags on mobile */}
            {hasMoreTags && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-800 transition-colors sm:hidden"
              >
                <span>{showAllTags ? 'Show less' : `Show ${resource.tags.length - 3} more`}</span>
                {showAllTags ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* User and Stats */}
          <div className={`flex ${isListView
              ? 'flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4'
              : 'flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-50 space-y-3 sm:space-y-0'
            }`}>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">{getInitials(resource.email)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{resource.email}</p>
                <p className="text-xs text-gray-500">Shared Resource</p>
              </div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Public Resources
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Discover amazing resources shared by our community</p>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="flex items-center space-x-2 bg-white rounded-full px-3 sm:px-4 py-2 shadow-sm border border-gray-200">
                <Globe className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{resources.length} Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/30 shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4">
            {/* Search Bar - Full width on mobile */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filters Row - Stack on mobile, horizontal on larger screens */}
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
                  className={`flex-1 sm:flex-none p-2 sm:p-2 rounded-md sm:rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-purple-500'}`}
                >
                  <Grid className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 sm:flex-none p-2 sm:p-2 rounded-md sm:rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-purple-500'}`}
                >
                  <List className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
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
          <div className={viewMode === 'grid'
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "space-y-6"
          }>
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource._id}
                resource={resource}
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No resources found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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