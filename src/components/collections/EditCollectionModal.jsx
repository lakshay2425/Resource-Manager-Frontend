import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function EditCollectionModal({ collection, onClose, onSave, isSaving }) {
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description ?? '');
  const [visibility, setVisibility] = useState(collection.visibility ?? 'private');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const payload = {};
    if (trimmedName !== collection.name) payload.name = trimmedName;

    const nextDescription = description.trim();
    if (nextDescription !== (collection.description ?? '')) {
      payload.description = nextDescription || null;
    }

    if (visibility !== collection.visibility) payload.visibility = visibility;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
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
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Visibility</label>
            <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="input">
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary" disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
