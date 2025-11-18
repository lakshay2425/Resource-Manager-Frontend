import { useState, useRef, useContext } from 'react';
import {
  Link,
  Type,
  FileText,
  Lock,
  Globe,
  Shield,
  Save,
  X,
  Plus,
  Sparkles,
  Eye,
  Check,
  AlertCircle,
  BookmarkPlus,
  Tag,
  User,
  ArrowRight,
  Zap,
  Star,
} from 'lucide-react';
import axiosInstance from "../utilis/Axios"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function ResourceCreationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    status: 'private',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [linkPreview, setLinkPreview] = useState(null);
  const linkInputRef = useRef(null);
  const { gmail } = useContext(AuthContext);


  const predefinedTags = [
    'React', 'JavaScript', 'Python', 'CSS', 'HTML', 'Node.js',
    'Design', 'UI/UX', 'Figma', 'Adobe', 'Photography',
    'Tutorial', 'Guide', 'Documentation', 'API', 'Database',
    'Free', 'Premium', 'Course', 'Template', 'Tool'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTag = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Resource name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Resource link is required';
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/resources", { ...formData, email: gmail });
      if (response.status === 201) {
        toast.success("Resource created successfully");
        setSubmitSuccess(true);
      }
      else {
        alert("Failed to create resource")
      }


    } catch (error) {
      console.error(error.message, "Failed to create resource");
      toast.error("Failed to create resource. Try again");
    } finally {
      setIsSubmitting(false);
      setFormData({
        name: '',
        description: '',
        link: '',
        status: 'private',
        tags: []
      });
    }

  };

  const generateLinkPreview = () => {
    if (isValidUrl(formData.link)) {
      setLinkPreview({
        title: formData.name || 'Resource Title',
        description: formData.description || 'Resource description will appear here...',
        url: formData.link,
        domain: new URL(formData.link).hostname
      });
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-white/20 backdrop-blur-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Resource Created Successfully! 🎉</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Your resource has been saved and is now available in your collection.</p>
            <div className="flex flex-col space-y-3">
              <button onClick={() => navigate("/resources")} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm sm:text-base">
                View My Resources
              </button>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base"
              >
                Create Another Resource
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-6 sm:py-8 lg:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
            <BookmarkPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Create New Resource
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
            Share something amazing with the community or keep it private for your personal collection
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-8">
              {/* Resource Name */}
              <div className="mb-6 sm:mb-8">
                <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                  <Type className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                  <span>Resource Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Give your resource an awesome name..."
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white/50 backdrop-blur-sm text-base sm:text-lg ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.name && (
                  <div className="flex items-center space-x-2 mt-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Resource Link */}
              <div className="mb-6 sm:mb-8">
                <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                  <Link className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <span>Resource Link</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    ref={linkInputRef}
                    onBlur={generateLinkPreview}
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://awesome-resource.com"
                    className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm text-base sm:text-lg pr-12 ${errors.link ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {isValidUrl(formData.link) && (
                    <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.link && (
                  <div className="flex items-center space-x-2 mt-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.link}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6 sm:mb-8">
                <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  <span>Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what makes this resource special. What will people learn or gain from it?"
                  rows="4"
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white/50 backdrop-blur-sm text-base sm:text-lg resize-none ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.description ? (
                    <div className="flex items-center space-x-2 text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.description}</span>
                    </div>
                  ) : (
                    <span className={`text-sm ${formData.description.length < 20 ? 'text-orange-500' : 'text-green-500'}`}>
                      {formData.description.length}/20+ characters
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6 sm:mb-8">
                <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  <span>Tags</span>
                </label>

                {/* Current Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-2 shadow-sm"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-white/20 rounded-full p-0.5 sm:p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add New Tag */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mb-3 sm:mb-4">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(currentTag);
                      }
                    }}
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(currentTag)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mx-auto sm:mx-0" />
                  </button>
                </div>

                {/* Predefined Tags */}
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center space-x-2">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Quick add popular tags:</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {predefinedTags.filter(tag => !formData.tags.includes(tag)).slice(0, 10).map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 px-2 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm transition-colors border border-gray-200 hover:border-purple-300"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy Status */}
              <div className="mb-6 sm:mb-8">
                <label className="flex items-center space-x-2 text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                  <span>Privacy Setting</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'private')}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all transform hover:scale-105 ${formData.status === 'private'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white/50 hover:border-purple-300'
                      }`}
                  >
                    <Lock className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${formData.status === 'private' ? 'text-purple-500' : 'text-gray-400'}`} />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">Private</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Only you can see this resource</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'public')}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all transform hover:scale-105 ${formData.status === 'public'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 bg-white/50 hover:border-green-300'
                      }`}
                  >
                    <Globe className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${formData.status === 'public' ? 'text-green-500' : 'text-gray-400'}`} />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">Public</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Everyone can discover this resource</p>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 transform ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl hover:scale-105 text-white'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Resource...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Create Resource</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 p-4 sm:p-6 lg:sticky lg:top-8">
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Live Preview</h3>
              </div>

              {/* Resource Preview Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${formData.status === 'public'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-purple-100 text-purple-700 border-purple-200'
                    }`}>
                    {formData.status === 'public' ? 'Public' : 'Private'}
                  </span>
                  {formData.status === 'public' ? (
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  ) : (
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  {formData.name || 'Your awesome resource name'}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">
                  {formData.description || 'Your resource description will appear here...'}
                </p>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {formData.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md sm:rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {formData.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">+{formData.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                      <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">
                      {formData.userEmail ? formData.userEmail.split('@')[0] : 'Your username'}
                    </span>
                  </div>

                  {formData.link && (
                    <a
                      href={formData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Visit
                    </a>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-white">
                <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <h4 className="text-sm sm:text-base font-semibold">Pro Tips</h4>
                </div>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/90">
                  <li className="flex items-start space-x-2">
                    <Star className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Use descriptive names to make resources easy to find</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Star className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Add relevant tags to help others discover your resources</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Star className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>Public resources help build the community knowledge base</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}