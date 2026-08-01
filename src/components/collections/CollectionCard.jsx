import { Link } from 'react-router-dom';
import { FolderOpen, Globe, Lock, Layers } from 'lucide-react';

export default function CollectionCard({ collection, showOwner = false }) {
  const isPublic = collection.visibility === 'public';

  return (
    <Link
      to={`/collections/${collection.id}`}
      className="group block bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300 p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="p-2.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
          <FolderOpen className="w-5 h-5 text-indigo-600" />
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
            isPublic ? 'bg-amber-50 text-slate-800' : 'bg-stone-100 text-stone-600'
          }`}
        >
          {isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {isPublic ? 'Public' : 'Private'}
        </span>
      </div>

      <h3
        className="text-lg font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {collection.name}
      </h3>

      {collection.description?.trim() && (
        <p className="mt-2 text-sm text-stone-600 line-clamp-2">{collection.description}</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          {collection.item_count ?? 0} items
        </span>
        {collection.item_statuses?.length > 0 && (
          <span className="truncate">
            · {collection.item_statuses.slice(0, 3).join(', ')}
            {collection.item_statuses.length > 3 ? '…' : ''}
          </span>
        )}
      </div>

      {showOwner && collection.owner?.name && (
        <p className="mt-3 text-xs text-stone-500">
          by <span className="font-medium text-stone-700">{collection.owner.name}</span>
        </p>
      )}
    </Link>
  );
}
