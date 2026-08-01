import { ExternalLink, GripVertical, Trash2, AlertTriangle } from 'lucide-react';

export default function CollectionItemRow({
  item,
  itemStatuses,
  isOwner,
  isFirst,
  isLast,
  onStatusChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  isUpdating,
  isRemoving,
}) {
  const resource = item.resource;

  return (
    <div
      draggable={isOwner}
      onDragStart={(e) => onDragStart?.(e, item.id)}
      onDragOver={(e) => onDragOver?.(e, item.id)}
      onDrop={(e) => onDrop?.(e, item.id)}
      className={`bg-white rounded-xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
        isOwner ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {isOwner && (
        <div className="hidden sm:flex text-stone-300 shrink-0">
          <GripVertical className="w-5 h-5" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {resource ? (
          <>
            <h4 className="font-semibold text-stone-900 truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {resource.name}
            </h4>
            {resource.description?.trim() && (
              <p className="text-sm text-stone-600 line-clamp-2 mt-1">{resource.description}</p>
            )}
            {resource.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {resource.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-start gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">
                {item.is_resource_owner
                  ? 'You deleted this resource'
                  : 'This resource was deleted by its owner'}
              </p>
              <p className="text-xs text-stone-500 mt-1">This item remains in your collection order.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {isOwner ? (
          <select
            value={item.status}
            onChange={(e) => onStatusChange(item.id, e.target.value)}
            disabled={isUpdating}
            className="input text-sm py-2 min-w-[120px]"
          >
            {itemStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <span className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium">
            {item.status}
          </span>
        )}

        {resource?.sourceLink && (
          <a
            href={resource.sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-amber-50 rounded-lg transition-colors"
          >
            Visit
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {isOwner && (
          <>
            <div className="flex sm:hidden gap-1">
              <button
                type="button"
                onClick={() => onMoveUp?.(item.id)}
                disabled={isFirst || isUpdating}
                className="px-2 py-1 text-xs border border-stone-200 rounded disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMoveDown?.(item.id)}
                disabled={isLast || isUpdating}
                className="px-2 py-1 text-xs border border-stone-200 rounded disabled:opacity-40"
              >
                ↓
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={isRemoving}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove from collection"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
