import { useContext, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Plus, Loader2, AlertCircle } from 'lucide-react';
import CollectionCard from '../components/collections/CollectionCard.jsx';
import { useMyCollections, useReorderCollections } from '../hooks/useCollections.js';
import { getCollectionErrorMessage, isAuthError } from '../utilis/collectionErrors.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { useLocalStorageState } from '../hooks/useLocalStorage.js';
import { formatUsernameForUrl } from '../utilis/collectionUrls.js';
import toast from 'react-hot-toast';

export default function MyCollections() {
  const { data: collections = [], isLoading, isError, error, refetch, isFetching } = useMyCollections();
  const { mutateAsync: reorderCollections, isPending: isReordering } = useReorderCollections();
  const dragCollectionIdRef = useRef(null);
  const { username: authUsername } = useContext(AuthContext);
  const [userInfo] = useLocalStorageState('userInfo', null);
  const ownerUsername = formatUsernameForUrl(authUsername || userInfo?.username || userInfo?.name);
  const orderedCollections = useMemo(
    () =>
      [...collections].sort(
        (a, b) =>
          (a.order_index ?? 0) - (b.order_index ?? 0) ||
          (a.created_at ?? '').localeCompare(b.created_at ?? '')
      ),
    [collections]
  );

  const buildReorderPayload = (nextCollections) =>
    nextCollections.map((collection, index) => ({ id: collection.id, order_index: index }));

  const handleMoveCollection = async (collectionId, direction) => {
    const index = orderedCollections.findIndex((collection) => collection.id === collectionId);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= orderedCollections.length) return;

    const nextCollections = [...orderedCollections];
    [nextCollections[index], nextCollections[targetIndex]] = [nextCollections[targetIndex], nextCollections[index]];
    try {
      await reorderCollections(buildReorderPayload(nextCollections));
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to reorder collections.'));
    }
  };

  const handleDragStart = (_event, collectionId) => {
    dragCollectionIdRef.current = collectionId;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (_event, targetCollectionId) => {
    const draggedCollectionId = dragCollectionIdRef.current;
    dragCollectionIdRef.current = null;
    if (!draggedCollectionId || draggedCollectionId === targetCollectionId) return;

    const fromIndex = orderedCollections.findIndex((collection) => collection.id === draggedCollectionId);
    const toIndex = orderedCollections.findIndex((collection) => collection.id === targetCollectionId);
    if (fromIndex < 0 || toIndex < 0) return;

    const nextCollections = [...orderedCollections];
    const [movedCollection] = nextCollections.splice(fromIndex, 1);
    nextCollections.splice(toIndex, 0, movedCollection);
    try {
      await reorderCollections(buildReorderPayload(nextCollections));
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to reorder collections.'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-slate-700 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-stone-900 mb-2">Failed to load collections</h2>
          <p className="text-stone-600 mb-6">{getCollectionErrorMessage(error)}</p>
          {isAuthError(error) ? (
            <Link to="/" className="btn-primary inline-flex">Go home to log in</Link>
          ) : (
            <button type="button" onClick={() => refetch()} className="btn-primary">Try again</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
                My Collections
              </h1>
              <p className="text-stone-600 mt-1 text-sm sm:text-base">Organize resources into ordered lists with custom statuses.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {isReordering && (
                <span className="text-xs text-stone-500 inline-flex items-center justify-center gap-1 sm:justify-start">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving order
                </span>
              )}
              {isFetching && !isLoading && (
                <span className="text-xs text-stone-500 inline-flex items-center justify-center gap-1 sm:justify-start">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing
                </span>
              )}
              <Link to="/collections/new" className="btn-primary w-full sm:w-auto justify-center">
                <Plus className="w-4 h-4 shrink-0" />
                New Collection
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {collections.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-xl border border-stone-200">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">No collections yet</h3>
            <p className="text-stone-600 mb-6 max-w-md mx-auto">
              Create your first collection to group resources with custom progress labels.
            </p>
            <Link to="/collections/new" className="btn-primary inline-flex w-full sm:w-auto justify-center">
              <Plus className="w-4 h-4" />
              Create Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 items-start">
            {orderedCollections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                ownerUsername={ownerUsername}
                canReorder
                isFirst={index === 0}
                isLast={index === orderedCollections.length - 1}
                isReordering={isReordering}
                onMoveUp={(id) => handleMoveCollection(id, 'up')}
                onMoveDown={(id) => handleMoveCollection(id, 'down')}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-stone-500">
          Browse community collections on{' '}
          <Link to="/collections/public" className="text-slate-700 hover:underline font-medium">
            Public Collections
          </Link>
        </p>
      </div>
    </div>
  );
}
