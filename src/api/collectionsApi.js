import axiosInstance from '../utilis/Axios.jsx';
import { formatUsernameForUrl } from '../utilis/collectionUrls.js';

export const listMyCollections = async () => {
  const { data } = await axiosInstance.get('/collections');
  return data.collections ?? [];
};

export const listPublicCollections = async () => {
  const { data } = await axiosInstance.get('/collections/public');
  return data.collections ?? [];
};

export const getCollectionBySlug = async (username, slug) => {  const { data } = await axiosInstance.get(
    `/collections/u/${formatUsernameForUrl(username)}/${slug}`
  );
  return data.collection;
};

export const createCollection = async (payload) => {
  const res = await axiosInstance.post('/collections', payload);
  return {
    status: res.status,
    collection: res.data.collection,
    message: res.data.message,
  };
};

export const updateCollection = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/collections/${id}`, payload);
  return data.collection;
};

export const deleteCollection = async (id) => {
  await axiosInstance.delete(`/collections/${id}`);
};

export const addCollectionItem = async (collectionId, payload) => {
  const res = await axiosInstance.post(`/collections/${collectionId}/items`, payload);
  return {
    status: res.status,
    item: res.data.item,
    message: res.data.message,
  };
};

export const createAndAddCollectionItem = async (collectionId, payload) => {
  const res = await axiosInstance.post(
    `/collections/${collectionId}/items/create-and-add`,
    payload
  );
  return {
    status: res.status,
    item: res.data.item,
    message: res.data.message,
  };
};

export const updateCollectionItemStatus = async (collectionId, itemId, status) => {
  const { data } = await axiosInstance.patch(
    `/collections/${collectionId}/items/${itemId}`,
    { status }
  );
  return data.item;
};

export const deleteCollectionItem = async (collectionId, itemId) => {
  await axiosInstance.delete(`/collections/${collectionId}/items/${itemId}`);
};

export const reorderCollectionItems = async (collectionId, items) => {
  const { data } = await axiosInstance.patch(
    `/collections/${collectionId}/items/reorder`,
    { items }
  );
  return data.updated;
};
