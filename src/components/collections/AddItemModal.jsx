import { useState, useEffect, useMemo } from 'react';
import { X, Loader2, Search, AlertCircle } from 'lucide-react';
import { newItemIdempotencyKey } from '../../utilis/idempotency.js';
import { looksLikeUrl } from '../../utilis/collectionUrls.js';
import { isValidUrl } from '../../utilis/tagsFunction.js';
import { getCollectionErrorMessage } from '../../utilis/collectionErrors.js';

export default function AddItemModal({
  resources,
  existingResourceIds = new Set(),
  itemStatuses = [],
  onClose,
  onAdd,
  isAdding,
  onCreateAndAdd,
  isCreatingAndAdding,
}) {
  const [view, setView] = useState('search');
  const [search, setSearch] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const hasStatuses = itemStatuses.length > 0;
  const [status, setStatus] = useState(itemStatuses[0] ?? '');
  const [idempotencyKey] = useState(() => newItemIdempotencyKey());

  const [createName, setCreateName] = useState('');
  const [createUrl, setCreateUrl] = useState('');
  const [createIdempotencyKey, setCreateIdempotencyKey] = useState(() => newItemIdempotencyKey());
  const [createFieldErrors, setCreateFieldErrors] = useState({});
  const [createSubmitError, setCreateSubmitError] = useState('');

  const availableResources = useMemo(
    () => resources.filter((resource) => !existingResourceIds.has(resource._id)),
    [resources, existingResourceIds]
  );

  const filteredResources = useMemo(() => {
    const term = search.toLowerCase();
    return availableResources.filter(
      (resource) =>
        resource.name?.toLowerCase().includes(term) ||
        resource.description?.toLowerCase().includes(term) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(term))
    );
  }, [availableResources, search]);

  const showCreateCta =
    view === 'search' &&
    search.trim() &&
    filteredResources.length === 0 &&
    availableResources.length > 0;

  useEffect(() => {
    if (selectedResourceId && !filteredResources.some((r) => r._id === selectedResourceId)) {
      setSelectedResourceId('');
    }
  }, [filteredResources, selectedResourceId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedResourceId) return;
    if (hasStatuses && !status) return;

    const payload = {
      resource_id: selectedResourceId,
      idempotency_key: idempotencyKey,
    };

    if (hasStatuses) {
      payload.status = status;
    }

    onAdd(payload);
  };

  const handleOpenCreateView = () => {
    const trimmed = search.trim();
    const isUrlLike = looksLikeUrl(trimmed);
    setCreateName(isUrlLike ? '' : trimmed);
    setCreateUrl(isUrlLike ? trimmed : '');
    setCreateFieldErrors({});
    setCreateSubmitError('');
    setCreateIdempotencyKey(newItemIdempotencyKey());
    setView('create');
  };

  const handleCancelCreate = () => {
    setCreateFieldErrors({});
    setCreateSubmitError('');
    setView('search');
  };

  const validateCreateForm = () => {
    const errors = {};
    const trimmedName = createName.trim();
    const trimmedUrl = createUrl.trim();

    if (!trimmedName) {
      errors.name = 'Resource name is required';
    } else if (trimmedName.length < 5) {
      errors.name = 'Resource name must be at least 5 characters';
    } else if (trimmedName.length > 100) {
      errors.name = 'Resource name must be at most 100 characters';
    }

    if (!trimmedUrl) {
      errors.url = 'Resource URL is required';
    } else if (!isValidUrl(trimmedUrl)) {
      errors.url = 'Please enter a valid URL';
    }

    setCreateFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateSubmitError('');

    if (!validateCreateForm()) return;

    try {
      await onCreateAndAdd({
        name: createName.trim(),
        url: createUrl.trim(),
        idempotency_key: createIdempotencyKey,
      });
    } catch (err) {
      setCreateSubmitError(getCollectionErrorMessage(err, 'Failed to create resource.'));
    }
  };

  const emptyMessage =
    availableResources.length === 0
      ? 'All your resources are already in this collection.'
      : 'No resources match your search.';

  const createCtaLabel = looksLikeUrl(search)
    ? '+ Create and add this resource'
    : '+ Create a new resource and add';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-lg w-full p-5 sm:p-8 max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
            {view === 'create' ? 'Create Resource' : 'Add Resource'}
          </h3>
          <button type="button" onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {view === 'search' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your resources..."
                className="input pl-10 w-full"
                disabled={availableResources.length === 0}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Resource</label>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                className="input w-full"
                required
                disabled={availableResources.length === 0}
              >
                <option value="">Select a resource</option>
                {filteredResources.map((resource) => (
                  <option key={resource._id} value={resource._id}>
                    {resource.name}
                  </option>
                ))}
              </select>
              {filteredResources.length === 0 && (
                <p className="text-xs text-stone-500 mt-2">{emptyMessage}</p>
              )}
              {showCreateCta && (
                <button
                  type="button"
                  onClick={handleOpenCreateView}
                  className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  {createCtaLabel}
                </button>
              )}
            </div>

            {hasStatuses && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input w-full" required>
                  {itemStatuses.map((itemStatus) => (
                    <option key={itemStatus} value={itemStatus}>
                      {itemStatus}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary justify-center" disabled={isAdding}>
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary justify-center"
                disabled={isAdding || !selectedResourceId || availableResources.length === 0}
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to collection'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Resource Name</label>
              <input
                type="text"
                value={createName}
                onChange={(e) => {
                  setCreateName(e.target.value);
                  if (createFieldErrors.name) {
                    setCreateFieldErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                className={`input w-full ${createFieldErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="My Resource"
                disabled={isCreatingAndAdding}
              />
              {createFieldErrors.name && (
                <p className="flex items-center gap-1.5 text-red-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm">{createFieldErrors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Resource URL</label>
              <input
                type="url"
                value={createUrl}
                onChange={(e) => {
                  setCreateUrl(e.target.value);
                  if (createFieldErrors.url) {
                    setCreateFieldErrors((prev) => ({ ...prev, url: '' }));
                  }
                }}
                className={`input w-full ${createFieldErrors.url ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                placeholder="https://example.com"
                disabled={isCreatingAndAdding}
              />
              {createFieldErrors.url && (
                <p className="flex items-center gap-1.5 text-red-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm">{createFieldErrors.url}</span>
                </p>
              )}
            </div>

            {createSubmitError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{createSubmitError}</p>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="flex-1 btn-secondary justify-center"
                disabled={isCreatingAndAdding}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary justify-center"
                disabled={isCreatingAndAdding}
              >
                {isCreatingAndAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create & Add'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
