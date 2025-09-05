import Spinner  from "../components/LoadingBar.jsx"
import { getInitials } from "../utilis/getInitials.js";
import { getCategoryColor } from "../utilis/getCategoryColor.js"
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import { useState, useEffect, } from 'react';
import {
  Search,
  ExternalLink,
  Globe,
  ArrowUpRight,
  X,
  Grid,
  List,
} from 'lucide-react';
import axiosInstance from "../utilis/Axios.jsx";

export default function PublicResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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


  const ResourceCard = ({ resource, isListView = false }) => (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group ${isListView ? 'flex items-center p-6 space-x-6' : 'p-6'}`}>
      <div className={`${isListView ? 'flex-1' : ''}`}>
        <div className={`flex ${isListView ? 'items-center justify-between' : 'items-start justify-between mb-4'}`}>
          <div className={`${isListView ? 'flex-1' : ''}`}>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getCategoryColor(resource.tags[0])}`}>
                <CategoryIcon category={resource.tags[0]} className="w-3 h-3" />
                <span>{resource.tags[0]}</span>
              </span>
              {resource.tags.length > 1 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  +{resource.tags.length - 1} more
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {resource.name}
            </h3>
            <p className={`text-gray-600 leading-relaxed ${isListView ? 'text-sm' : 'mb-4'}`}>
              {resource.description}
            </p>
          </div>

          {!isListView && (
            <a
              href={resource.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full hover:shadow-lg transform hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* All Tags */}
        <div className={`flex flex-wrap gap-2 ${isListView ? 'mb-3' : 'mb-4'}`}>
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-50 text-gray-600 px-2 py-1 rounded-lg text-xs hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer flex items-center space-x-1"
            >
              {/* {React.createElement(getCategoryIcon(tag), { className: "w-3 h-3" })} */}
              <CategoryIcon category={tag} className="w-3 h-3" />
              <span>#{tag}</span>
            </span>
          ))}
        </div>

        {/* User and Stats */}
        <div className={`flex ${isListView ? 'items-center justify-between' : 'items-center justify-between pt-4 border-t border-gray-50'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{getInitials(resource.email)}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{resource.email}</p>
              <p className="text-xs text-gray-500">Shared Resource</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isListView && (
              <a
                href={resource.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Visit</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Spinner message={"Loading Resources..."} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Public Resources
              </h1>
              <p className="text-gray-600 mt-1">Discover amazing resources shared by our community</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <Globe className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">{resources.length} Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, descriptions, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filters Row */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="alphabetical">Alphabetical</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-purple-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-purple-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {(searchTerm || selectedCategory !== 'All') && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>
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
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
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