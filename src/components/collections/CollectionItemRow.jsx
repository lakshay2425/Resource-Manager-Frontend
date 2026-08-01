import { ExternalLink, GripVertical, Trash2, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';

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
      className={`bg-white rounded-xl border border-stone-200 p-4 sm:p-5 ${
        isOwner ? 'sm:cursor-grab sm:active:cursor-grabbing' : ''
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-4">
        {isOwner && (
          <div className="hidden sm:flex text-stone-300 shrink-0 pt-1">
            <GripVertical className="w-5 h-5" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isOwner && (
            <div className="flex items-center justify-between gap-2 mb-3 sm:hidden">
              <span className="text-xs font-medium text-stone-500">Reorder</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => onMoveUp?.(item.id)}
                  disabled={isFirst || isUpdating}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-stone-200 rounded-lg disabled:opacity-40 active:bg-stone-50"
                  aria-label="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => onMoveDown?.(item.id)}
                  disabled={isLast || isUpdating}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-stone-200 rounded-lg disabled:opacity-40 active:bg-stone-50"
                  aria-label="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  Down
                </button>
              </div>
            </div>
          )}

          {resource ? (
            <>
              <h4
                className="font-semibold text-stone-900 text-base sm:text-lg break-words"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {resource.name}
              </h4>
              {resource.description?.trim() && (
                <p className="text-sm text-stone-600 line-clamp-3 sm:line-clamp-2 mt-1.5">{resource.description}</p>
              )}
              {resource.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
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
              <div className="min-w-0">
                <p className="font-medium text-sm break-words">
                  {item.is_resource_owner
                    ? 'You deleted this resource'
                    : 'This resource was deleted by its owner'}
                </p>
                <p className="text-xs text-stone-500 mt-1">This item remains in your collection order.</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full sm:w-auto sm:min-w-[200px] flex flex-col gap-2.5 shrink-0 border-t border-stone-100 pt-4 sm:border-0 sm:pt-0">
          {isOwner ? (
            <select
              value={item.status}
              onChange={(e) => onStatusChange(item.id, e.target.value)}
              disabled={isUpdating}
              className="input text-sm py-2.5 w-full"
            >
              {itemStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          ) : (
            <span className="inline-flex justify-center sm:justify-start px-3 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium">
              {item.status}
            </span>
          )}

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            {resource?.sourceLink && (
              <a
                href={resource.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-slate-700 bg-stone-50 hover:bg-amber-50 rounded-lg transition-colors col-span-2 sm:col-span-1 sm:flex-1"
              >
                Visit
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            )}

            {isOwner && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={isRemoving}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 ${
                  resource?.sourceLink ? 'col-span-2 sm:col-span-1' : 'col-span-2'
                }`}
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
