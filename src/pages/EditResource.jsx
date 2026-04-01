import axiosInstance from "../utilis/Axios.jsx";
import { CategoryIcon } from "../utilis/getCategoryIcon.jsx";
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Globe,
  Lock,
  Link,
  Hash,
  AlertTriangle,
  Type,
  X,
  Plus,
  Check,
  FileText,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form';

export default function EditResourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialResource = location.state?.resource;


  const [isAnimating, setIsAnimating] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [tagSuggestions] = useState([
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'Node.js',
    'Frontend', 'Backend', 'Full Stack', 'CSS', 'HTML', 'Python',
    'Course', 'Tutorial', 'Documentation', 'Tools', 'Framework',
    'Interview', 'DSA', 'Database', 'AI', 'Machine Learning'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, dirtyFields, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      sourceLink: '',
      tags: [],
      status: 'public',
      description: ''
    }
  });

  const currentTags = watch('tags');
  const currentStatus = watch('status');

  useEffect(() => {
    if (initialResource) {
      reset({
        name: initialResource.name,
        sourceLink: initialResource.sourceLink,
        tags: initialResource.tags,
        status: initialResource.status,
        description: initialResource.description,
      });
    }
    setIsAnimating(true);
  }, [initialResource, reset, navigate]);


  const getDirtyValues = (dirtyFields, allValues) => {
    const changedValues = {};

    for (const key in dirtyFields) {
      if (dirtyFields[key] === true) {
        changedValues[key] = allValues[key];
      }
    }
    return changedValues;
  };

  const handleStatusToggle = () => {
    setValue('status', currentStatus === 'private' ? 'public' : 'private', { shouldDirty: true });
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      setValue('tags', [...currentTags, trimmedTag], { shouldDirty: true });
      setNewTag('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove), { shouldDirty: true });
  };

  const onSubmit = async (data) => {
    const updatedFields = getDirtyValues(dirtyFields, data);

    if (Object.keys(updatedFields).length === 0) {
      toast('No changes detected to save.', { icon: 'ℹ️' });
      return;
    }

    const saveToastId = toast.loading('Saving changes...');
    setSaveStatus('saving');

    try {
      const response = await axiosInstance.patch(`/resources/${id}`, { updatedFields });

      if (response.status === 200) {
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setResourceToDelete(null);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(`/resources/${resourceId}`);
      if (response.status === 200) {
        toast.success("Resource deleted successfully");
        navigate("/resources");
      } else {
        toast.error("Failed to delete resource.");
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Error deleting resource.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSuggestions = tagSuggestions.filter(tag =>
    tag.toLowerCase().includes(newTag.toLowerCase()) &&
    !currentTags.includes(tag)
  );


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-stone-50">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="p-2 text-stone-500 hover:text-slate-700 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
                    Edit Resource
                  </h1>
                  <p className="text-stone-500 text-sm">Update your resource details</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${currentStatus === 'private'
                ? 'bg-stone-100 text-stone-600'
                : 'bg-amber-50 text-slate-800'
                }`}>
                {currentStatus === 'private' ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Private</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Public</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`transition-all duration-500 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>

            {/* Main Form Card */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-6">
              <div className="space-y-6">

                {/* Status Toggle Section */}
                <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-stone-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>Visibility</h3>
                      <p className="text-stone-500 text-sm">
                        {currentStatus === 'private'
                          ? 'Only you can see this resource'
                          : 'Anyone can discover and view this resource'
                        }
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleStatusToggle}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 ${currentStatus === 'public'
                        ? 'bg-slate-600'
                        : 'bg-stone-300'
                        }`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-all duration-300 ${currentStatus === 'public' ? 'translate-x-7' : 'translate-x-1'
                        }`}>
                        <div className="flex items-center justify-center h-full">
                          {currentStatus === 'public' ? (
                            <Globe className="w-3 h-3 text-slate-600" />
                          ) : (
                            <Lock className="w-3 h-3 text-stone-400" />
                          )}
                        </div>
                      </span>
                      <input type="hidden" {...register('status')} />
                    </button>
                  </div>
                </div>

                {/* Resource Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-stone-700">
                    <Type className="w-4 h-4 text-slate-700" />
                    <span>Resource Name</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Resource name is required' })}
                    className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="Enter a descriptive name for your resource"
                  />
                  {errors.name && <p className="text-red-600 text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.name.message}</p>}
                </div>

                {/* Resource Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-stone-700">
                    <FileText className="w-4 h-4 text-slate-700" />
                    <span>Description</span>
                  </label>
                  <textarea
                    id="description"
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className={`input resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="Describe what this resource is about and why it's useful"
                  />
                  {errors.description && <p className="text-red-600 text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.description.message}</p>}
                </div>

                {/* Source Link */}
                <div className="space-y-2">
                  <label htmlFor="sourceLink" className="flex items-center gap-2 text-sm font-medium text-stone-700">
                    <Link className="w-4 h-4 text-slate-700" />
                    <span>Source Link</span>
                  </label>
                  <div className="relative">
                    <input
                      id="sourceLink"
                      type="url"
                      {...register('sourceLink', { required: 'Source Link is required' })}
                      className={`input pr-12 ${errors.sourceLink ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                      placeholder="https://example.com/your-resource"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <a
                        href={watch('sourceLink')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-stone-400 hover:text-slate-700 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                  {errors.sourceLink && <p className="text-red-600 text-sm flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.sourceLink.message}</p>}
                </div>

                {/* Tags Section */}
                <div className="space-y-3">
                  <label htmlFor="tags" className="flex items-center gap-2 text-sm font-medium text-stone-700">
                    <Hash className="w-4 h-4 text-slate-700" />
                    <span>Tags</span>
                    <span className="text-stone-400 font-normal">({currentTags.length} tags)</span>
                  </label>

                  {/* Current Tags */}
                  <div className="flex flex-wrap gap-2 p-4 bg-stone-50 rounded-xl border border-stone-200 min-h-[60px] items-start">
                    {currentTags.map((tag, index) => (
                      <div
                        key={index}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-slate-800 rounded-lg text-sm font-medium"
                      >
                        <CategoryIcon category={tag} className="w-3 h-3" />
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="p-0.5 hover:bg-amber-200 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {currentTags.length === 0 && (
                      <p className="text-stone-400 text-sm italic">No tags added yet. Add some tags to categorize your resource.</p>
                    )}
                  </div>

                  {/* Add New Tag */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => {
                            setNewTag(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                          }}
                          onFocus={() => setShowSuggestions(newTag.length > 0)}
                          className="input"
                          placeholder="Type a tag and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(newTag);
                            }
                          }}
                        />

                        {/* Tag Suggestions */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-stone-200 max-h-48 overflow-y-auto z-20">
                            {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                              <button
                                type="button"
                                key={index}
                                onClick={() => addTag(suggestion)}
                                className="w-full px-4 py-2.5 text-left hover:bg-amber-50 hover:text-slate-800 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center gap-2 text-sm"
                              >
                                <CategoryIcon category={suggestion} className="w-4 h-4 text-stone-400" />
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
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  openDeleteModal();
                  setResourceToDelete(initialResource);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {saveStatus === 'saved' && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-slate-700" />
                </div>
                <div>
                  <p className="text-green-800 font-medium">Resource updated successfully</p>
                  <p className="text-slate-700 text-sm">Your changes have been saved.</p>
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
      </form>

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
                <span className="tag tag-primary">
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
                onClick={() => handleDeleteResource(resourceToDelete._id)}
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