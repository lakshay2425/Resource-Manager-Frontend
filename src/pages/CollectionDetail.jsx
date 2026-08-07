import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  Lock,
  Loader2,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../utilis/Axios.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import CollectionItemRow from '../components/collections/CollectionItemRow.jsx';
import EditCollectionModal from '../components/collections/EditCollectionModal.jsx';
import AddItemModal from '../components/collections/AddItemModal.jsx';
import {
  collectionKeys,
  useCollectionBySlug,
  useMyCollections,
  useUpdateCollection,
  useDeleteCollection,
  useAddCollectionItem,
  useUpdateCollectionItemStatus,
  useDeleteCollectionItem,
  useReorderCollectionItems,
} from '../hooks/useCollections.js';
import { getCollectionErrorMessage, isAuthError } from '../utilis/collectionErrors.js';
import { getCollectionPath, getResourceId, isValidSlug, isValidUsername } from '../utilis/collectionUrls.js';

export default function CollectionDetail() {
  const { username, slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [resources, setResources] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const dragItemIdRef = useRef(null);

  const routeValid = isValidUsername(username) && isValidSlug(slug);
  const detailQueryKey = collectionKeys.detail(username, slug);

  const { data: collection, isLoading, isError, error, refetch } = useCollectionBySlug(username, slug, {
    enabled: routeValid,
  });

  const { data: myCollections = [] } = useMyCollections({
    enabled: isAuthenticated,
  });

  const collectionId = collection?.id;

  const isOwner = useMemo(() => {
    if (!isAuthenticated || !collection) return false;
    return myCollections.some((c) => c.id === collection.id);
  }, [isAuthenticated, myCollections, collection]);

  const { mutateAsync: updateCollection, isPending: isUpdatingCollection } = useUpdateCollection();
  const { mutateAsync: deleteCollection, isPending: isDeletingCollection } = useDeleteCollection();
  const { mutateAsync: addItem, isPending: isAddingItem } = useAddCollectionItem(collectionId, detailQueryKey);
  const { mutateAsync: updateItemStatus } = useUpdateCollectionItemStatus(collectionId, detailQueryKey);
  const { mutateAsync: removeItem } = useDeleteCollectionItem(collectionId, detailQueryKey);
  const { mutateAsync: reorderItems, isPending: isReordering } = useReorderCollectionItems(collectionId, detailQueryKey);

  useEffect(() => {
    if (!isOwner) return;

    const fetchResources = async () => {
      try {
        const response = await axiosInstance.get('/resources');
        setResources(response.data.data || []);
      } catch (err) {
        console.error('Failed to load resources for add-item flow', err);
      }
    };

    fetchResources();
  }, [isOwner]);

  const sortedItems = useMemo(() => {
    if (!collection?.items) return [];
    return [...collection.items].sort(
      (a, b) => a.order_index - b.order_index || a.created_at.localeCompare(b.created_at)
    );
  }, [collection?.items]);

  const existingResourceIds = useMemo(() => {
    return new Set(
      sortedItems
        .map((item) => item.resource_id ?? getResourceId(item.resource))
        .filter(Boolean)
    );
  }, [sortedItems]);

  const itemStatuses = collection?.item_statuses ?? [];

  const handleStatusChange = async (itemId, status) => {
    setUpdatingItemId(itemId);
    try {
      await updateItemStatus({ itemId, status });
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to update status.'));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setRemovingItemId(itemId);
    try {
      await removeItem(itemId);
      toast.success('Item removed from collection.');
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to remove item.'));
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleAddItem = async (payload) => {
    try {
      const result = await addItem(payload);
      if (result.status === 200) {
        toast.success('Resource was already in this collection.');
      } else {
        toast.success('Resource added to collection.');
      }
      setShowAddModal(false);
      await refetch();
    } catch (err) {
      const message = getCollectionErrorMessage(err, 'Failed to add resource.');
      toast.error(message);
    }
  };

  const handleSaveCollection = async (payload) => {
    if (!collectionId) return;

    try {
      const updated = await updateCollection({
        id: collectionId,
        payload,
        detailQueryKey,
      });
      toast.success('Collection updated.');
      setShowEditModal(false);

      const ownerUsername = updated?.owner?.username ?? collection.owner?.username ?? username;
      const nextSlug = updated?.slug ?? collection.slug;

      if (payload.slug && nextSlug !== slug && ownerUsername) {
        navigate(getCollectionPath(ownerUsername, nextSlug), { replace: true });
      }
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to update collection.'));
    }
  };

  const handleDeleteCollection = async () => {
    if (!collectionId) return;

    try {
      await deleteCollection({ id: collectionId, detailQueryKey });
      toast.success('Collection deleted.');
      navigate('/collections');
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to delete collection.'));
    }
  };

  const buildReorderPayload = (items) =>
    items.map((item, index) => ({ id: item.id, order_index: index }));

  const handleMoveItem = async (itemId, direction) => {
    const index = sortedItems.findIndex((item) => item.id === itemId);
    if (index < 0) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedItems.length) return;

    const nextItems = [...sortedItems];
    [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];

    try {
      await reorderItems(buildReorderPayload(nextItems));
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to reorder items.'));
    }
  };

  const handleDragStart = (_e, itemId) => {
    dragItemIdRef.current = itemId;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (_e, targetItemId) => {
    const draggedId = dragItemIdRef.current;
    dragItemIdRef.current = null;
    if (!draggedId || draggedId === targetItemId) return;

    const fromIndex = sortedItems.findIndex((item) => item.id === draggedId);
    const toIndex = sortedItems.findIndex((item) => item.id === targetItemId);
    if (fromIndex < 0 || toIndex < 0) return;

    const nextItems = [...sortedItems];
    const [moved] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, moved);

    try {
      await reorderItems(buildReorderPayload(nextItems));
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to reorder items.'));
    }
  };

  if (!routeValid) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-stone-600">Invalid collection URL.</p>
          <Link to="/collections/public" className="btn-primary inline-flex mt-4">Browse collections</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-slate-700 animate-spin" />
      </div>
    );
  }

  if (isError || !collection) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-stone-900 mb-2">
            {isAuthError(error) ? 'This collection is private' : 'Collection unavailable'}
          </h2>
          <p className="text-stone-600 mb-6">{getCollectionErrorMessage(error)}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthError(error) && (
              <Link to="/" className="btn-primary">Log in</Link>
            )}
            <Link to="/collections/public" className="btn-secondary">Browse public collections</Link>
          </div>
        </div>
      </div>
    );
  }

  const isPublic = collection.visibility === 'public';
  const shareUsername = collection.owner?.username ?? username;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <Link
            to={isOwner ? '/collections' : '/collections/public'}
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-3 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">{isOwner ? 'My Collections' : 'Public Collections'}</span>
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    isPublic ? 'bg-amber-50 text-slate-800' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {isPublic ? 'Public' : 'Private'}
                </span>
                <span className="text-xs text-stone-500">
                  {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''}
                </span>
                {shareUsername && collection.slug && (
                  <span className="text-xs text-stone-400 truncate">
                    /collections/{shareUsername}/{collection.slug}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl font-bold text-stone-900 break-words" style={{ fontFamily: 'var(--font-display)' }}>
                {collection.name}
              </h1>
              {collection.description?.trim() && (
                <p className="text-stone-600 mt-2 text-sm sm:text-base break-words">{collection.description}</p>
              )}
              {!isOwner && collection.owner?.name && (
                <p className="text-sm text-stone-500 mt-2">
                  by{' '}
                  <span className="font-medium text-stone-700">
                    {collection.owner.username ? `@${collection.owner.username}` : collection.owner.name}
                  </span>
                </p>
              )}
              {itemStatuses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {itemStatuses.map((status) => (
                    <span key={status} className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-md text-xs font-medium">
                      {status}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isOwner && (
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="truncate">Add resource</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="btn-secondary w-full sm:w-auto justify-center"
                >
                  <Pencil className="w-4 h-4 shrink-0" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {isReordering && (
          <p className="text-xs text-stone-500 inline-flex items-center gap-1 mb-4">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving order…
          </p>
        )}

        {sortedItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4 bg-white rounded-xl border border-stone-200">
            <p className="text-stone-600 mb-4 text-sm sm:text-base">This collection has no items yet.</p>
            {isOwner && (
              <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary inline-flex w-full sm:w-auto justify-center">
                <Plus className="w-4 h-4" />
                Add your first resource
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {sortedItems.map((item, index) => (
              <CollectionItemRow
                key={item.id}
                item={item}
                itemStatuses={itemStatuses}
                isOwner={isOwner}
                isFirst={index === 0}
                isLast={index === sortedItems.length - 1}
                onStatusChange={handleStatusChange}
                onRemove={handleRemoveItem}
                onMoveUp={() => handleMoveItem(item.id, 'up')}
                onMoveDown={() => handleMoveItem(item.id, 'down')}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isUpdating={updatingItemId === item.id || isReordering}
                isRemoving={removingItemId === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {showEditModal && (
        <EditCollectionModal
          collection={collection}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveCollection}
          isSaving={isUpdatingCollection}
        />
      )}

      {showAddModal && (
        <AddItemModal
          resources={resources}
          existingResourceIds={existingResourceIds}
          itemStatuses={itemStatuses}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
          isAdding={isAddingItem}
        />
      )}

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Delete Collection
              </h3>
              <p className="text-stone-600 text-sm">
                Delete <strong>{collection.name}</strong> and all its items? This cannot be undone.
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" onClick={() => setShowDeleteModal(false)} className="flex-1 btn-secondary" disabled={isDeletingCollection}>
                Cancel
              </button>
              <button type="button" onClick={handleDeleteCollection} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50" disabled={isDeletingCollection}>
                {isDeletingCollection ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
