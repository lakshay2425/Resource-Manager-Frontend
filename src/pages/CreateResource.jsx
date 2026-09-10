import { useState, useRef } from 'react';
import {
  Link,
  Type,
  Lock,
  Check,
  AlertCircle,
  Layers,
  ArrowRight,
  Lightbulb,
  Loader2
} from 'lucide-react';
import axiosInstance from "../utilis/Axios"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  isDuplicateResourceError,
  getDuplicateResourceMessage,
} from '../utilis/resourceErrors.js';
import { isPlanLimitError, getPlanLimitMessage } from '../utilis/planErrors.js';
import PlanLimitBanner from '../components/PlanLimitBanner.jsx';

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
  const [submitError, setSubmitError] = useState('');
  const [planLimitError, setPlanLimitError] = useState('');
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

    if (submitError && (field === 'name' || field === 'link')) {
      setSubmitError('');
    }

    if (planLimitError && (field === 'name' || field === 'link')) {
      setPlanLimitError('');
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
    setSubmitError('');
    setPlanLimitError('');
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
      if (isPlanLimitError(error)) {
        const message = getPlanLimitMessage(error);
        setPlanLimitError(message);
        toast.error(message);
      } else if (isDuplicateResourceError(error)) {
        setSubmitError(getDuplicateResourceMessage(error));
      } else {
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        toast.error(serverMessage || "Failed to create resource. Try again");
      }
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

  const tips = [
    'Use a clear name (at least 5 characters)',
    'Paste a full URL including https://',
    'Edit later to add tags, description, or go public',
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-12">
        <header className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-md">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 mb-2 sm:mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Add New Resource
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
            Save a link with a name. You can add description, tags, and visibility later when editing.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 sm:p-7 lg:p-8"
        >
          <div className="mb-5 sm:mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
              <Type className="w-4 h-4 text-slate-700 shrink-0" />
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
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-sm">{errors.name}</span>
              </div>
            ) : (
              <p
                className={`text-sm mt-2 ${
                  formData.name.trim().length > 0 && formData.name.trim().length < 5
                    ? 'text-amber-600'
                    : 'text-stone-500'
                }`}
              >
                At least 5 characters
              </p>
            )}
          </div>

          <div className="mb-5 sm:mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
              <Link className="w-4 h-4 text-slate-700 shrink-0" />
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
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Check className="w-5 h-5 text-slate-700" />
                </div>
              )}
            </div>
            {errors.link && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-sm">{errors.link}</span>
              </div>
            )}
          </div>

          <div className="mb-6 sm:mb-7 rounded-xl border border-stone-200 bg-stone-50 p-3.5 sm:p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-slate-700 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-800">Created as private</p>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
                New resources are always private. Change visibility, add tags, or write a description from the edit page.
              </p>
            </div>
          </div>

          {submitError && (
            <div className="mb-5 sm:mb-6 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <PlanLimitBanner
            message={planLimitError}
            onDismiss={() => setPlanLimitError('')}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3.5 sm:py-4 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

        <aside
          className="mt-5 sm:mt-6 rounded-xl border border-amber-100 bg-amber-50/70 p-4 sm:p-5"
          aria-label="Tips for creating a resource"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Lightbulb className="w-4 h-4 text-amber-700 shrink-0" />
            <h2 className="text-sm font-semibold text-amber-900">Quick tips</h2>
          </div>
          <ul className="grid gap-2.5 sm:gap-3 md:grid-cols-3">
            {tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-stone-700 leading-snug sm:leading-relaxed"
              >
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
