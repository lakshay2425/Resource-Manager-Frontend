import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listMyCollections,
  listPublicCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addCollectionItem,
  updateCollectionItemStatus,
  deleteCollectionItem,
  reorderCollectionItems,
} from '../api/collectionsApi';

export const collectionKeys = {
  all: ['collections'],
  mine: () => [...collectionKeys.all, 'mine'],
  public: () => [...collectionKeys.all, 'public'],
  detail: (id) => [...collectionKeys.all, 'detail', id],
};

export const useMyCollections = (options = {}) => {
  return useQuery({
    queryKey: collectionKeys.mine(),
    queryFn: listMyCollections,
    ...options,
  });
};

export const usePublicCollections = () => {
  return useQuery({
    queryKey: collectionKeys.public(),
    queryFn: listPublicCollections,
  });
};

export const useCollection = (id, options = {}) => {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => getCollection(id),
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollection,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
      if (result.collection?.visibility === 'public') {
        queryClient.invalidateQueries({ queryKey: collectionKeys.public() });
      }
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateCollection(id, payload),
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.public() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collection.id) });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.public() });
      queryClient.removeQueries({ queryKey: collectionKeys.detail(id) });
    },
  });
};

export const useAddCollectionItem = (collectionId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => addCollectionItem(collectionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
    },
  });
};

export const useUpdateCollectionItemStatus = (collectionId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, status }) =>
      updateCollectionItemStatus(collectionId, itemId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
    },
  });
};

export const useDeleteCollectionItem = (collectionId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => deleteCollectionItem(collectionId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
    },
  });
};

export const useReorderCollectionItems = (collectionId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items) => reorderCollectionItems(collectionId, items),
    onMutate: async (items) => {
      await queryClient.cancelQueries({ queryKey: collectionKeys.detail(collectionId) });
      const previous = queryClient.getQueryData(collectionKeys.detail(collectionId));

      if (previous) {
        const orderMap = new Map(items.map(({ id, order_index }) => [id, order_index]));
        const nextItems = [...previous.items]
          .map((item) =>
            orderMap.has(item.id)
              ? { ...item, order_index: orderMap.get(item.id) }
              : item
          )
          .sort((a, b) => a.order_index - b.order_index || a.created_at.localeCompare(b.created_at));

        queryClient.setQueryData(collectionKeys.detail(collectionId), {
          ...previous,
          items: nextItems,
        });
      }

      return { previous };
    },
    onError: (_error, _items, context) => {
      if (context?.previous) {
        queryClient.setQueryData(collectionKeys.detail(collectionId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
    },
  });
};
