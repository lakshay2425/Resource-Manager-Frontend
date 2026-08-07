import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { isValidSlug } from '../../utilis/collectionUrls.js';

export default function EditCollectionModal({ collection, onClose, onSave, isSaving }) {
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description ?? '');
  const [visibility, setVisibility] = useState(collection.visibility ?? 'private');
  const [slug, setSlug] = useState(collection.slug ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const trimmedSlug = slug.trim().toLowerCase();
    if (trimmedSlug && !isValidSlug(trimmedSlug)) {
      return;
    }

    const payload = {};
    if (trimmedName !== collection.name) payload.name = trimmedName;

    const nextDescription = description.trim();
    if (nextDescription !== (collection.description ?? '')) {
      payload.description = nextDescription || null;
    }

    if (visibility !== collection.visibility) payload.visibility = visibility;

    if (trimmedSlug && trimmedSlug !== collection.slug) payload.slug = trimmedSlug;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    onSave(payload);
  };

  const slugInvalid = slug.trim() && !isValidSlug(slug.trim().toLowerCase());

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
            Edit Collection
          </h3>
          <button type="button" onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input resize-none w-full"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">URL slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              className="input w-full"
              placeholder="my-reading-list"
            />
            <p className="text-xs text-stone-500 mt-1.5">
              Lowercase letters, numbers, and hyphens only. Renaming the collection does not change this automatically.
            </p>
            {slugInvalid && (
              <p className="text-xs text-red-600 mt-1">Invalid slug format.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Visibility</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="input w-full">
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary justify-center" disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary justify-center" disabled={isSaving || slugInvalid}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
