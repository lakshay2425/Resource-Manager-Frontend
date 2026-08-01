import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, X, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateCollection } from '../hooks/useCollections.js';
import { useEnsureLocalUser } from '../hooks/useLocalUser.js';
import { newCollectionIdempotencyKey } from '../utilis/idempotency.js';
import { getCollectionErrorMessage } from '../utilis/collectionErrors.js';
import { useLocalStorageState } from '../hooks/useLocalStorage.js';

const MAX_STATUSES = 5;

export default function CreateCollection() {
  const navigate = useNavigate();
  const [userInfo] = useLocalStorageState('userInfo', null);
  const idempotencyKeyRef = useRef(newCollectionIdempotencyKey());

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [statusInput, setStatusInput] = useState('');
  const [itemStatuses, setItemStatuses] = useState(['To Read', 'Reading', 'Done']);

  const { mutateAsync: ensureUser, isPending: isEnsuringUser } = useEnsureLocalUser();
  const { mutateAsync: createCollection, isPending: isCreating } = useCreateCollection();

  const addStatus = () => {
    const trimmed = statusInput.trim();
    if (!trimmed) return;
    if (itemStatuses.length >= MAX_STATUSES) {
      toast.error('You can add up to 5 status labels.');
      return;
    }
    if (itemStatuses.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('Status already added.');
      return;
    }
    setItemStatuses((prev) => [...prev, trimmed]);
    setStatusInput('');
  };

  const removeStatus = (status) => {
    if (itemStatuses.length <= 1) {
      toast.error('At least one status label is required.');
      return;
    }
    setItemStatuses((prev) => prev.filter((s) => s !== status));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Collection name is required.');
      return;
    }

    const cleanedStatuses = itemStatuses.map((s) => s.trim()).filter(Boolean);
    if (cleanedStatuses.length < 1 || cleanedStatuses.length > MAX_STATUSES) {
      toast.error('Add between 1 and 5 non-empty status labels.');
      return;
    }

    try {
      const displayName = userInfo?.name || userInfo?.username || 'ResourceHub User';
      await ensureUser(displayName);

      const result = await createCollection({
        name: trimmedName,
        description: description.trim() || undefined,
        visibility,
        item_statuses: cleanedStatuses,
        idempotency_key: idempotencyKeyRef.current,
      });

      if (result.status === 200) {
        toast.success('Collection already exists — opening it.');
      } else {
        toast.success('Collection created!');
      }

      navigate(`/collections/${result.collection.id}`);
    } catch (error) {
      toast.error(getCollectionErrorMessage(error, 'Failed to create collection.'));
    }
  };

  const isSubmitting = isEnsuringUser || isCreating;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Link to="/collections" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-4 sm:mb-6">
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Back to My Collections
        </Link>

        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Create Collection
          </h1>
          <p className="text-stone-600 text-sm mb-6 sm:mb-8">
            Status labels are set now and cannot be changed later. Choose labels that match your workflow.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="e.g. Frontend Learning Path"
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
                placeholder="What is this collection for?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Visibility</label>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)} className="input">
                <option value="private">Private — only you can view</option>
                <option value="public">Public — visible on community browse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Item statuses * <span className="text-stone-400 font-normal">(1–5, fixed after create)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {itemStatuses.map((status) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm"
                  >
                    {status}
                    <button
                      type="button"
                      onClick={() => removeStatus(status)}
                      className="text-stone-400 hover:text-red-600"
                      aria-label={`Remove ${status}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              {itemStatuses.length < MAX_STATUSES && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addStatus();
                      }
                    }}
                    className="input flex-1 w-full"
                    placeholder="Add a status label"
                  />
                  <button type="button" onClick={addStatus} className="btn-secondary shrink-0 w-full sm:w-auto justify-center">
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Link to="/collections" className="flex-1 btn-secondary text-center justify-center">
                Cancel
              </Link>
              <button type="submit" className="flex-1 btn-primary justify-center" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Collection'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
