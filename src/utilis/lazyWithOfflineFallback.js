import { lazy } from 'react';

export const isChunkLoadError = (error) => {
  const message = error?.message ?? '';
  return (
    error?.name === 'ChunkLoadError' ||
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('Failed to fetch')
  );
};

export const redirectToOfflinePage = () => {
  if (!window.location.pathname.endsWith('/offline.html') && window.location.pathname !== '/offline') {
    window.location.replace('/offline.html');
  }
};

export const lazyWithOfflineFallback = (importer) =>
  lazy(async () => {
    try {
      return await importer();
    } catch (error) {
      if (typeof navigator !== 'undefined' && !navigator.onLine && isChunkLoadError(error)) {
        redirectToOfflinePage();
        return { default: () => null };
      }
      throw error;
    }
  });

export const registerOfflineChunkHandler = () => {
  const handleRejection = (event) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine && isChunkLoadError(event.reason)) {
      event.preventDefault();
      redirectToOfflinePage();
    }
  };

  window.addEventListener('unhandledrejection', handleRejection);
  return () => window.removeEventListener('unhandledrejection', handleRejection);
};
