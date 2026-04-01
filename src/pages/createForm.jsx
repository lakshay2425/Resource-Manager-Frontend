import { useState, useRef, useContext } from 'react';
import {
  Link,
  Type,
  FileText,
  Lock,
  Globe,
  Shield,
  X,
  Plus,
  Sparkles,
  Eye,
  Check,
  AlertCircle,
  Layers,
  Tag,
  User,
  ArrowRight,
  Lightbulb,
  Loader2
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

    if (formData.tags.length < 1) {
      newErrors.tags = 'At least one tag is required';
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
      toast.error("Please enter valid information before submitting.");
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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Resource Created
            </h3>
            <p className="text-stone-600 mb-6">
              Your resource has been saved and is now available in your collection.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/resources")}
                className="btn-primary w-full"
              >
                <span>View My Resources</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="text-slate-700 hover:text-slate-800 font-medium text-sm"
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
    <div className="min-h-screen bg-stone-50 py-8 lg:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Add New Resource
          </h1>
          <p className="text-stone-600 max-w-lg mx-auto">
            Save a valuable link to your collection or share it with the community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8">
              {/* Resource Name */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                  <Type className="w-4 h-4 text-slate-700" />
                  <span>Resource Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Give your resource a descriptive name"
                  className={`input ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {errors.name && (
                  <div className="flex items-center gap-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Resource Link */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                  <Link className="w-4 h-4 text-slate-700" />
                  <span>Resource Link</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    ref={linkInputRef}
                    onBlur={generateLinkPreview}
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://example.com/resource"
                    className={`input pr-12 ${errors.link ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                  {isValidUrl(formData.link) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Check className="w-5 h-5 text-slate-700" />
                    </div>
                  )}
                </div>
                {errors.link && (
                  <div className="flex items-center gap-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.link}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span>Description</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this resource is about and why it's useful"
                  rows="4"
                  className={`input resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.description ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{errors.description}</span>
                    </div>
                  ) : (
                    <span className={`text-sm ${formData.description.length < 20 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {formData.description.length}/20+ characters
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                  <Tag className="w-4 h-4 text-slate-700" />
                  <span>Tags</span>
                </label>

                {/* Current Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-amber-100 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-amber-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}


                {/* Add New Tag */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    className={`input flex-1 ${errors.tags ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(currentTag);
                      }
                    }}
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={() => addTag(currentTag)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Error Message */}
                {errors.tags && formData.tags.length === 0 && (
                  <div className='flex items-center gap-2 text-red-600 mb-3'>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.tags}</span>
                  </div>
                )}

                {/* Predefined Tags */}
                <div className="space-y-2">
                  <p className="text-sm text-stone-500 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Quick add popular tags:</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {predefinedTags.filter(tag => !formData.tags.includes(tag)).slice(0, 10).map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-slate-800 rounded-lg text-sm transition-colors border border-stone-200 hover:border-amber-200"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Privacy Status */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-3">
                  <Shield className="w-4 h-4 text-slate-700" />
                  <span>Visibility</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'private')}
                    className={`p-5 rounded-xl border-2 transition-all ${formData.status === 'private'
                      ? 'border-slate-600 bg-amber-50'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                  >
                    <Lock className={`w-6 h-6 mx-auto mb-2 ${formData.status === 'private' ? 'text-slate-700' : 'text-stone-400'}`} />
                    <h3 className={`text-sm font-semibold mb-1 ${formData.status === 'private' ? 'text-slate-800' : 'text-stone-700'}`}>Private</h3>
                    <p className="text-xs text-stone-500">Only you can see this</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('status', 'public')}
                    className={`p-5 rounded-xl border-2 transition-all ${formData.status === 'public'
                      ? 'border-slate-600 bg-amber-50'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                  >
                    <Globe className={`w-6 h-6 mx-auto mb-2 ${formData.status === 'public' ? 'text-slate-700' : 'text-stone-400'}`} />
                    <h3 className={`text-sm font-semibold mb-1 ${formData.status === 'public' ? 'text-slate-800' : 'text-stone-700'}`}>Public</h3>
                    <p className="text-xs text-stone-500">Visible to everyone</p>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Resource...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Resource</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-5">
                <Eye className="w-5 h-5 text-slate-700" />
                <h3 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-display)' }}>Live Preview</h3>
              </div>

              {/* Resource Preview Card */}
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`tag ${formData.status === 'public' ? 'bg-amber-100 text-slate-800' : 'bg-stone-200 text-stone-600'}`}>
                    {formData.status === 'public' ? (
                      <>
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {formData.name || 'Your resource name'}
                </h3>

                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {formData.description || 'Your resource description will appear here...'}
                </p>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {formData.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-stone-200 text-stone-600 px-2 py-1 rounded-md text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {formData.tags.length > 3 && (
                      <span className="text-stone-400 text-xs py-1">+{formData.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-stone-500">
                      {formData.userEmail ? formData.userEmail.split('@')[0] : 'You'}
                    </span>
                  </div>

                  {formData.link && (
                    <a
                      href={formData.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-700 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      Visit
                    </a>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-semibold text-amber-800">Tips</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Use descriptive names for easy searching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Add relevant tags to help categorize</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Public resources help the community</span>
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