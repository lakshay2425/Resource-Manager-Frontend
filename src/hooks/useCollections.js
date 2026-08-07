import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listMyCollections,
  listPublicCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  addCollectionItem,
  updateCollectionItemStatus,
  deleteCollectionItem,
  reorderCollectionItems,
} from '../api/collectionsApi';
import { formatUsernameForUrl } from '../utilis/collectionUrls.js';

export const collectionKeys = {
  all: ['collections'],
  mine: () => [...collectionKeys.all, 'mine'],
  public: () => [...collectionKeys.all, 'public'],
  detail: (username, slug) => [...collectionKeys.all, 'detail', username, slug],
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

export const useCollectionBySlug = (username, slug, options = {}) => {
  return useQuery({
    queryKey: collectionKeys.detail(username, slug),
    queryFn: () => getCollectionBySlug(username, slug),
    enabled: Boolean(username && slug),
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
    onSuccess: (collection, { detailQueryKey }) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.public() });
      if (detailQueryKey) {
        queryClient.invalidateQueries({ queryKey: detailQueryKey });
      }
      if (collection?.owner?.username && collection?.slug) {
        queryClient.invalidateQueries({
          queryKey: collectionKeys.detail(
            formatUsernameForUrl(collection.owner.username),
            collection.slug
          ),
        });
      }
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => deleteCollection(id),
    onSuccess: (_data, { detailQueryKey }) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.public() });
      if (detailQueryKey) {
        queryClient.removeQueries({ queryKey: detailQueryKey });
      }
    },
  });
};

export const useAddCollectionItem = (collectionId, detailQueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => addCollectionItem(collectionId, payload),
    onSuccess: () => {
      if (detailQueryKey) {
        queryClient.invalidateQueries({ queryKey: detailQueryKey });
      }
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
    },
  });
};

export const useUpdateCollectionItemStatus = (collectionId, detailQueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, status }) =>
      updateCollectionItemStatus(collectionId, itemId, status),
    onSuccess: () => {
      if (detailQueryKey) {
        queryClient.invalidateQueries({ queryKey: detailQueryKey });
      }
    },
  });
};

export const useDeleteCollectionItem = (collectionId, detailQueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => deleteCollectionItem(collectionId, itemId),
    onSuccess: () => {
      if (detailQueryKey) {
        queryClient.invalidateQueries({ queryKey: detailQueryKey });
      }
      queryClient.invalidateQueries({ queryKey: collectionKeys.mine() });
    },
  });
};

export const useReorderCollectionItems = (collectionId, detailQueryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items) => reorderCollectionItems(collectionId, items),
    onMutate: async (items) => {
      if (!detailQueryKey) return {};

      await queryClient.cancelQueries({ queryKey: detailQueryKey });
      const previous = queryClient.getQueryData(detailQueryKey);

      if (previous) {
        const orderMap = new Map(items.map(({ id, order_index }) => [id, order_index]));
        const nextItems = [...previous.items]
          .map((item) =>
            orderMap.has(item.id)
              ? { ...item, order_index: orderMap.get(item.id) }
              : item
          )
          .sort((a, b) => a.order_index - b.order_index || a.created_at.localeCompare(b.created_at));

        queryClient.setQueryData(detailQueryKey, {
          ...previous,
          items: nextItems,
        });
      }

      return { previous };
    },
    onError: (_error, _items, context) => {
      if (detailQueryKey && context?.previous) {
        queryClient.setQueryData(detailQueryKey, context.previous);
      }
    },
    onSettled: () => {
      if (detailQueryKey) {
        queryClient.invalidateQueries({ queryKey: detailQueryKey });
      }
    },
  });
};
