import axiosInstance from "../utilis/Axios.jsx";
import { getCategoryColor } from "../utilis/getCategoryColor.js";
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Globe,
  Lock,
  Link,
  Hash,
  Type,
  X,
  Plus,
  Check,
  BookOpen,
  Eye,
  Trash2
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form'; 

export default function EditResourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialResource = location.state?.resource; // Use optional chaining for safety


  // State for non-form related UI elements
  const [isAnimating, setIsAnimating] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const [tagSuggestions] = useState([
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js',
    'Frontend', 'Backend', 'Full Stack', 'CSS', 'HTML', 'Python',
    'Course', 'Tutorial', 'Documentation', 'Tools', 'Framework',
    'Interview', 'DSA', 'Database', 'AI', 'Machine Learning'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- React Hook Form Integration ---
  const {
    register,
    handleSubmit,
    reset, // Crucial for setting default values and clearing dirty state
    watch, // To get current form values managed by RHF
    setValue, // To programmatically update RHF state (for tags, status)
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm({
    mode: 'onChange', // Validate on change, also updates dirtyFields immediately
    defaultValues: { // Initial empty state, will be hydrated by useEffect
      name: '',
      sourceLink: '',
      tags: [],
      status: 'public', // Default status, ensure it matches your API's default if creating new
      description: ''
    }
  });

  // Watch specific fields to update UI that depends on their values (like tags display, status toggle)
  const currentTags = watch('tags');
  const currentStatus = watch('status');

  // Effect to set default values for react-hook-form from `initialResource`
  useEffect(() => {
    if (initialResource) {
      reset({
        name: initialResource.name,
        sourceLink: initialResource.sourceLink,
        tags: initialResource.tags, 
        status: initialResource.status, 
        description: initialResource.description ,
      });
    } 
    setIsAnimating(true); 
  }, [initialResource, reset, navigate]); 


  // Function to filter only dirty fields (recursive for nested objects)
  const getDirtyValues = (dirtyFields, allValues) => {
    const changedValues = {};

    for (const key in dirtyFields) {
      if (dirtyFields[key] === true) {
        changedValues[key] = allValues[key];
      } 
    }
    return changedValues;
  };

  // --- Handlers for form logic ---

  // Handle status toggle using setValue
  const handleStatusToggle = () => {
    setValue('status', currentStatus === 'private' ? 'public' : 'private', { shouldDirty: true });
  };

  // Handle adding a tag using setValue
  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      setValue('tags', [...currentTags, trimmedTag], { shouldDirty: true }); // Mark tags field as dirty
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  // Handle removing a tag using setValue
  const removeTag = (tagToRemove) => {
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove), { shouldDirty: true }); // Mark tags field as dirty
  };

  // This is the function called by handleSubmit from react-hook-form
  const onSubmit = async (data) => { // 'data' contains the current, valid form values from RHF
    const updatedFields = getDirtyValues(dirtyFields, data);

    if (Object.keys(updatedFields).length === 0) {
      toast('No changes detected to save.', { icon: 'ℹ️' });
      return;
    }

    const saveToastId = toast.loading('Saving changes...');
    setSaveStatus('saving'); // Update UI status

    try {
      // Send the PATCH request with only the dirty fields
      const response = await axiosInstance.patch(`/resources/`, {updatedFields, id});

      if (response.status === 201) {
        toast.success("Resource updated successfully", { id: saveToastId });
        reset(data); 
        navigate("/resources");
      } else {
        toast.error("Failed to update resource.");
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to update resource.');
    } finally {
      setSaveStatus('idle'); 
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const response = await axiosInstance.delete(`/resources?id=${resourceId}`);
        if (response.status === 200) {
          toast.success("Resource deleted successfully");
          navigate("/resources"); // Navigate after deletion
        } else {
          toast.error("Failed to delete resource.");
        }
      } catch (error) {
        console.error('Error deleting resource:', error);
        toast.error('Error deleting resource.');
      }
    }
  };

  const filteredSuggestions = tagSuggestions.filter(tag =>
    tag.toLowerCase().includes(newTag.toLowerCase()) &&
    !currentTags.includes(tag) // Use currentTags from watch
  );


  return (
    // Wrap your entire form with the form tag and onSubmit handler from RHF
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 transform hover:scale-105">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Edit Resource
                </h1>
                <p className="text-gray-600 text-sm mt-1">Update your resource details</p>
              </div>
            </div>

            {/* Status Indicator (using currentStatus from watch) */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
              currentStatus === 'private'
                ? 'bg-gray-50 border-gray-200 text-gray-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              {currentStatus === 'private' ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="font-medium">Private</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">Public</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-1000 transform ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>

          {/* Main Form Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl p-8 mb-8">
            <div className="space-y-8">

              {/* Status Toggle Section (using currentStatus from watch) */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Resource Visibility</h3>
                    <p className="text-gray-600 text-sm">
                      {currentStatus === 'private'
                        ? 'Only you can see this resource'
                        : 'Anyone can discover and view this resource'
                      }
                    </p>
                  </div>
                  <button
                    type="button" 
                    onClick={handleStatusToggle} 
                    className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-105 ${
                      currentStatus === 'public'
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-200'
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg shadow-gray-200'
                    }`}
                  >
                    <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-all duration-300 ${
                      currentStatus === 'public' ? 'translate-x-14' : 'translate-x-2'
                    }`}>
                      <div className="flex items-center justify-center h-full">
                        {currentStatus === 'public' ? (
                          <Globe className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </span>
                    {/* Hidden input for RHF to track status */}
                    <input type="hidden" {...register('status')} />
                  </button>
                </div>
              </div>

              {/* Resource Name */}
              <div className="space-y-3">
                <label htmlFor="name" className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <Type className="w-5 h-5 text-purple-500" />
                  <span>Resource Name</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Resource name is required' })}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                    placeholder="Enter a descriptive name for your resource..."
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/0 to-blue-400/0 hover:from-purple-400/5 hover:to-blue-400/5 transition-all duration-300 pointer-events-none"></div>
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Resource Description */}
              <div className="space-y-3">
                <label htmlFor="description" className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <span>Description</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 resize-none"
                    placeholder="Describe what this resource is about and why it's useful..."
                  />
                </div>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Source Link */}
              <div className="space-y-3">
                <label htmlFor="sourceLink" className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <Link className="w-5 h-5 text-purple-500" />
                  <span>Source Link</span>
                </label>
                <div className="relative">
                  <input
                    id="sourceLink"
                    type="url"
                    {...register('sourceLink', { required: 'Source Link is required' })}
                    className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                    placeholder="https://example.com/your-resource"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <button type="button" className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {errors.sourceLink && <p className="text-red-500 text-sm mt-1">{errors.sourceLink.message}</p>}
              </div>

              {/* Tags Section (using currentTags from watch) */}
              <div className="space-y-4">
                <label htmlFor="tags" className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <Hash className="w-5 h-5 text-purple-500" />
                  <span>Tags</span>
                  <span className="text-sm font-normal text-gray-500">({currentTags.length} tags)</span>
                </label>

                {/* Current Tags */}
                <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-2xl border border-purple-100/50 min-h-[60px] items-start">
                  {currentTags.map((tag, index) => (
                    <div
                      key={index} 
                      className={`group flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${getCategoryColor(tag)}`}
                    >
                      <CategoryIcon category={tag} />
                      <span className="font-medium">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="w-4 h-4 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {currentTags.length === 0 && (
                    <p className="text-gray-400 italic">No tags added yet. Add some tags to categorize your resource.</p>
                  )}
                </div>

                {/* Add New Tag */}
                <div className="relative">
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => {
                          setNewTag(e.target.value);
                          setShowSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowSuggestions(newTag.length > 0)}
                        className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                        placeholder="Type a tag and press Enter..."
                        onKeyDown={(e) => { 
                          if (e.key === 'Enter') {
                            e.preventDefault(); 
                            addTag(newTag);
                          }
                        }}
                      />

                      {/* Tag Suggestions */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-48 overflow-y-auto z-20">
                          {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                            <button
                              type="button"
                              key={index}
                              onClick={() => addTag(suggestion)}
                              className="w-full px-4 py-2 text-left hover:bg-purple-50 hover:text-purple-700 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center space-x-2"
                            >
                              <CategoryIcon category={suggestion} className="w-4 h-4 text-gray-400" />
                              <span>{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button" 
                      onClick={() => addTag(newTag)}
                      disabled={!newTag.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between space-x-4">
            <button
              type="button" 
              onClick={() => handleDeleteResource(id)}
              className="flex items-center space-x-2 px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Resource</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                type="button" 
                onClick={() => navigate(-1)} // Assuming you want to go back
                className="px-8 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit" // This button now correctly triggers the RHF handleSubmit
                disabled={!isDirty || isSubmitting} // Use isDirty and isSubmitting from RHF
                className={`relative overflow-hidden px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none flex items-center space-x-2 min-w-[140px] justify-center ${
                  !isDirty || isSubmitting ? 'cursor-not-allowed opacity-70' : '' // Dim button when disabled
                }`}
              >
                {saveStatus === 'saving' && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                )}
                {saveStatus === 'saved' && <Check className="w-4 h-4" />}
                {saveStatus === 'idle' && <Save className="w-4 h-4" />}
                <span>
                  {saveStatus === 'saving' ? 'Saving...' :
                   saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                </span>

                {saveStatus === 'saved' && (
                  <div className="absolute inset-0 bg-green-400 rounded-xl animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {saveStatus === 'saved' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3 animate-fade-in">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-green-800 font-medium">Resource updated successfully!</p>
                <p className="text-green-600 text-sm">Your changes have been saved and are now live.</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowSuggestions(false)}
        ></div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}