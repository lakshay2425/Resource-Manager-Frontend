import { useState, useRef } from 'react';
import {
  Link,
  Type,
  Lock,
  Eye,
  Check,
  AlertCircle,
  Layers,
  User,
  ArrowRight,
  Lightbulb,
  Loader2
} from 'lucide-react';
import axiosInstance from "../utilis/Axios"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

export default function ResourceCreationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    link: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const linkInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      newErrors.name = 'Resource name is required';
    } else if (trimmedName.length < 5) {
      newErrors.name = 'Resource name must be at least 5 characters';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Resource link is required';
    } else if (!isValidUrl(formData.link.trim())) {
      newErrors.link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please enter valid information before submitting.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post("/resources", {
        name: formData.name.trim(),
        link: formData.link.trim(),
      });
      if (response.status === 201) {
        toast.success(response.data?.message || "Resource created successfully");
        setSubmitSuccess(true);
        setFormData({ name: '', link: '' });
      } else {
        toast.error("Failed to create resource");
      }
    } catch (error) {
      console.error(error.message, "Failed to create resource");
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      toast.error(serverMessage || "Failed to create resource. Try again");
    } finally {
      setIsSubmitting(false);
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
              Your resource has been saved as private. Add a description, tags, or make it public from the edit page.
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
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-md">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Add New Resource
          </h1>
          <p className="text-stone-600 max-w-lg mx-auto">
            Save a link with a name. You can add description, tags, and visibility later when editing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8">
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
                {errors.name ? (
                  <div className="flex items-center gap-2 mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                ) : (
                  <p className={`text-sm mt-2 ${formData.name.trim().length > 0 && formData.name.trim().length < 5 ? 'text-amber-600' : 'text-stone-500'}`}>
                    At least 5 characters
                  </p>
                )}
              </div>

              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                  <Link className="w-4 h-4 text-slate-700" />
                  <span>Resource Link</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    ref={linkInputRef}
                    value={formData.link}
                    onChange={(e) => handleInputChange('link', e.target.value)}
                    placeholder="https://example.com/resource"
                    className={`input pr-12 ${errors.link ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                  {isValidUrl(formData.link.trim()) && (
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

              <div className="mb-8 rounded-xl border border-stone-200 bg-stone-50 p-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-slate-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-stone-800">Created as private</p>
                  <p className="text-xs text-stone-500 mt-1">
                    New resources are always private. Change visibility, add tags, or write a description from the edit page.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
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
            </form>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-2 mb-5">
                <Eye className="w-5 h-5 text-slate-700" />
                <h3 className="text-base font-semibold text-stone-800" style={{ fontFamily: 'var(--font-display)' }}>Live Preview</h3>
              </div>

              <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="tag bg-stone-200 text-stone-600">
                    <Lock className="w-3 h-3" />
                    <span>Private</span>
                  </span>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {formData.name.trim() || 'Your resource name'}
                </h3>

                <p className="text-stone-500 text-sm leading-relaxed mb-4 italic">
                  No description yet — add one when editing.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-stone-500">You</span>
                  </div>

                  {isValidUrl(formData.link.trim()) && (
                    <a
                      href={formData.link.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-700 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      Visit
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-semibold text-amber-800">Tips</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Use a clear name (at least 5 characters)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Paste a full URL including https://</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Edit later to add tags, description, or go public</span>
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
