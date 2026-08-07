import { useState, useEffect, useMemo } from 'react';
import { X, Loader2, Search } from 'lucide-react';
import { newItemIdempotencyKey } from '../../utilis/idempotency.js';

export default function AddItemModal({
  resources,
  existingResourceIds = new Set(),
  itemStatuses = [],
  onClose,
  onAdd,
  isAdding,
}) {
  const [search, setSearch] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState('');
  const hasStatuses = itemStatuses.length > 0;
  const [status, setStatus] = useState(itemStatuses[0] ?? '');
  const [idempotencyKey] = useState(() => newItemIdempotencyKey());

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

  const emptyMessage =
    availableResources.length === 0
      ? 'All your resources are already in this collection.'
      : 'No resources match your search.';

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
            Add Resource
          </h3>
          <button type="button" onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

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
      </div>
    </div>
  );
}
