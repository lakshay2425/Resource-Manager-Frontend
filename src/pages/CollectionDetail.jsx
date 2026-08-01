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
  useCollection,
  useMyCollections,
  useUpdateCollection,
  useDeleteCollection,
  useAddCollectionItem,
  useUpdateCollectionItemStatus,
  useDeleteCollectionItem,
  useReorderCollectionItems,
} from '../hooks/useCollections.js';
import { getCollectionErrorMessage, isAuthError } from '../utilis/collectionErrors.js';
import { isValidUuid } from '../utilis/idempotency.js';

export default function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [resources, setResources] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);
  const dragItemIdRef = useRef(null);

  const validId = isValidUuid(id);

  const { data: collection, isLoading, isError, error, refetch } = useCollection(id, {
    enabled: validId,
  });

  const { data: myCollections = [] } = useMyCollections({
    enabled: isAuthenticated,
  });

  const isOwner = useMemo(
    () => isAuthenticated && myCollections.some((c) => c.id === id),
    [isAuthenticated, myCollections, id]
  );

  const { mutateAsync: updateCollection, isPending: isUpdatingCollection } = useUpdateCollection();
  const { mutateAsync: deleteCollection, isPending: isDeletingCollection } = useDeleteCollection();
  const { mutateAsync: addItem, isPending: isAddingItem } = useAddCollectionItem(id);
  const { mutateAsync: updateItemStatus } = useUpdateCollectionItemStatus(id);
  const { mutateAsync: removeItem } = useDeleteCollectionItem(id);
  const { mutateAsync: reorderItems, isPending: isReordering } = useReorderCollectionItems(id);

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
    try {
      await updateCollection({ id, payload });
      toast.success('Collection updated.');
      setShowEditModal(false);
    } catch (err) {
      toast.error(getCollectionErrorMessage(err, 'Failed to update collection.'));
    }
  };

  const handleDeleteCollection = async () => {
    try {
      await deleteCollection(id);
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

  if (!validId) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-stone-600">Invalid collection ID.</p>
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

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Link
            to={isOwner ? '/collections' : '/collections/public'}
            className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {isOwner ? 'My Collections' : 'Public Collections'}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
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
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
                {collection.name}
              </h1>
              {collection.description?.trim() && (
                <p className="text-stone-600 mt-2">{collection.description}</p>
              )}
              {collection.item_statuses?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {collection.item_statuses.map((status) => (
                    <span key={status} className="px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-md text-xs font-medium">
                      {status}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isOwner && (
              <div className="flex flex-wrap gap-2 shrink-0">
                <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Add resource
                </button>
                <button type="button" onClick={() => setShowEditModal(true)} className="btn-secondary">
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {isReordering && (
          <p className="text-xs text-stone-500 inline-flex items-center gap-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving order…
          </p>
        )}

        {sortedItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
            <p className="text-stone-600 mb-4">This collection has no items yet.</p>
            {isOwner && (
              <button type="button" onClick={() => setShowAddModal(true)} className="btn-primary inline-flex">
                <Plus className="w-4 h-4" />
                Add your first resource
              </button>
            )}
          </div>
        ) : (
          sortedItems.map((item, index) => (
            <CollectionItemRow
              key={item.id}
              item={item}
              itemStatuses={collection.item_statuses}
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
          ))
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
          itemStatuses={collection.item_statuses}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
          isAdding={isAddingItem}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
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
            <div className="flex gap-3">
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
