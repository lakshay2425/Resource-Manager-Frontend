import { Link } from 'react-router-dom';
import { FolderOpen, Globe, Lock, Layers, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { getCollectionPath, formatUsernameForUrl } from '../../utilis/collectionUrls.js';

export default function CollectionCard({
  collection,
  showOwner = false,
  ownerUsername,
  canReorder = false,
  isFirst = false,
  isLast = false,
  isReordering = false,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const isPublic = collection.visibility === 'public';
  const username = formatUsernameForUrl(ownerUsername ?? collection.owner?.username ?? collection.owner?.name);
  const slug = collection.slug;
  const href = username && slug ? getCollectionPath(username, slug) : '/collections';

  const body = (
    <>
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
          <span className="break-words line-clamp-2 sm:line-clamp-1 sm:truncate">
            · {collection.item_statuses.slice(0, 3).join(', ')}
            {collection.item_statuses.length > 3 ? '…' : ''}
          </span>
        )}
      </div>

      {showOwner && collection.owner?.name && (
        <p className="mt-3 text-xs text-stone-500">
          by{' '}
          <span className="font-medium text-stone-700">
            {collection.owner.username ? `@${collection.owner.username}` : collection.owner.name}
          </span>
        </p>
      )}
    </>
  );

  if (!canReorder) {
    return (
      <Link
        to={href}
        className="group block bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300 p-4 sm:p-6 active:bg-stone-50"
      >
        {body}
      </Link>
    );
  }

  return (
    <div
      className="group bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-300"
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(e, collection.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e, collection.id);
      }}
    >
      <div className="flex items-center justify-between gap-2 px-4 sm:px-6 pt-4">
        <button
          type="button"
          draggable={!isReordering}
          disabled={isReordering}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', collection.id);
            e.dataTransfer.effectAllowed = 'move';
            onDragStart?.(e, collection.id);
          }}
          className="inline-flex items-center justify-center p-1.5 text-stone-400 hover:text-stone-600 rounded-md disabled:opacity-40 cursor-grab active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onMoveUp?.(collection.id)}
            disabled={isFirst || isReordering}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-50"
            aria-label="Move up"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Up
          </button>
          <button
            type="button"
            onClick={() => onMoveDown?.(collection.id)}
            disabled={isLast || isReordering}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-50"
            aria-label="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Down
          </button>
        </div>
      </div>
      <Link
        to={href}
        className="block p-4 sm:p-6 pt-3 active:bg-stone-50 rounded-b-xl"
      >
        {body}
      </Link>
    </div>
  );
}
