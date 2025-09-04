import  { useState, useRef } from 'react';
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
// import Navbar from '../components/Navbar';

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
    
    setIsSubmitting(true);
    
    const response = await axiosInstance.post("/resources", formData);
    if(response.status === 201){ 
      alert("Resource created successfully");
      setSubmitSuccess(true);
      setIsSubmitting(false);
    }
    else{
       alert("Failed to create resource")
    }
    
    
    // Reset form after success
      setFormData({
        name: '',
        description: '',
        link: '',
        status: 'private',
        tags: []
      });

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
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-white/20 backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Resource Created Successfully! 🎉</h3>
            <p className="text-gray-600 mb-6">Your resource has been saved and is now available in your collection.</p>
            <div className="flex flex-col space-y-3">
              <button onClick={()=> navigate("/resources")} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                View My Resources
              </button>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="text-purple-600 hover:text-purple-700 font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      {/* <Navbar/> */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookmarkPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Create New Resource
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share something amazing with the community or keep it private for your personal collection
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8">
              {/* Resource Name */}
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-3">
                  <Type className="w-5 h-5 text-purple-500" />
                  <span>Resource Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Give your resource an awesome name..."
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white/50 backdrop-blur-sm text-lg ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.name && (
                  <div className="flex items-center space-x-2 mt-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Resource Link */}
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-3">
                  <Link className="w-5 h-5 text-blue-500" />
                  <span>Resource Link</span>
                </label>
                <div className="relative">
                  <input
                    ref={linkInputRef}
                    type="url"
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    onBlur={generateLinkPreview}
                    placeholder="https://awesome-resource.com"
                    className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm text-lg pr-12 ${
                      errors.link ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {isValidUrl(formData.link) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Check className="w-5 h-5 text-green-500" />
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
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-3">
                  <FileText className="w-5 h-5 text-green-500" />
                  <span>Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what makes this resource special. What will people learn or gain from it?"
                  rows="4"
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white/50 backdrop-blur-sm text-lg resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-200'
                  }`}
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
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-3">
                  <Tag className="w-5 h-5 text-orange-500" />
                  <span>Tags</span>
                </label>
                
                {/* Current Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-sm"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add New Tag */}
                <div className="flex space-x-2 mb-4">
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
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white/50 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(currentTag)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Predefined Tags */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Quick add popular tags:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags.filter(tag => !formData.tags.includes(tag)).slice(0, 10).map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 px-3 py-1 rounded-lg text-sm transition-colors border border-gray-200 hover:border-purple-300"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>


              {/* Privacy Status */}
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                  <Shield className="w-5 h-5 text-pink-500" />
                  <span>Privacy Setting</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'private')}
                    className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                      formData.status === 'private' 
                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                        : 'border-gray-200 bg-white/50 hover:border-purple-300'
                    }`}
                  >
                    <Lock className={`w-8 h-8 mx-auto mb-3 ${formData.status === 'private' ? 'text-purple-500' : 'text-gray-400'}`} />
                    <h3 className="font-semibold text-gray-800 mb-2">Private</h3>
                    <p className="text-sm text-gray-600">Only you can see this resource</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'public')}
                    className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                      formData.status === 'public' 
                        ? 'border-green-500 bg-green-50 shadow-lg' 
                        : 'border-gray-200 bg-white/50 hover:border-green-300'
                    }`}
                  >
                    <Globe className={`w-8 h-8 mx-auto mb-3 ${formData.status === 'public' ? 'text-green-500' : 'text-gray-400'}`} />
                    <h3 className="font-semibold text-gray-800 mb-2">Public</h3>
                    <p className="text-sm text-gray-600">Everyone can discover this resource</p>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-2xl hover:scale-105 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Resource...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Save className="w-5 h-5" />
                    <span>Create Resource</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-6 sticky top-8">
              <div className="flex items-center space-x-2 mb-6">
                <Eye className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
              </div>

              {/* Resource Preview Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    formData.status === 'public' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-purple-100 text-purple-700 border-purple-200'
                  }`}>
                    {formData.status === 'public' ? 'Public' : 'Private'}
                  </span>
                  {formData.status === 'public' ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {formData.name || 'Your awesome resource name'}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {formData.description || 'Your resource description will appear here...'}
                </p>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-50 text-gray-600 px-2 py-1 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {formData.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">+{formData.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
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
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-4 text-white">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-5 h-5" />
                  <h4 className="font-semibold">Pro Tips</h4>
                </div>
                <ul className="space-y-2 text-sm text-white/90">
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