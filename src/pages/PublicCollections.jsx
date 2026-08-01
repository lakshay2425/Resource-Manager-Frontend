import { Link } from 'react-router-dom';
import { FolderOpen, Loader2, AlertCircle } from 'lucide-react';
import CollectionCard from '../components/collections/CollectionCard.jsx';
import { usePublicCollections } from '../hooks/useCollections.js';
import { getCollectionErrorMessage } from '../utilis/collectionErrors.js';

export default function PublicCollections() {
  const { data: collections = [], isLoading, isError, error, refetch, isFetching } = usePublicCollections();

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
          <h2 className="text-xl font-semibold text-stone-900 mb-2">Failed to load public collections</h2>
          <p className="text-stone-600 mb-6">{getCollectionErrorMessage(error)}</p>
          <button type="button" onClick={() => refetch()} className="btn-primary">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-display)' }}>
                Public Collections
              </h1>
              <p className="text-stone-600 mt-1">Discover curated resource lists shared by the community.</p>
            </div>
            {isFetching && !isLoading && (
              <span className="text-xs text-stone-500 inline-flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Refreshing
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {collections.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">No public collections yet</h3>
            <p className="text-stone-600 max-w-md mx-auto">
              When users share collections publicly, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} showOwner />
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-sm text-stone-500">
          Manage your own lists on{' '}
          <Link to="/collections" className="text-slate-700 hover:underline font-medium">
            My Collections
          </Link>
        </p>
      </div>
    </div>
  );
}
