import { useState, useEffect } from 'react';
import { Bookmark, ExternalLink, Edit3, Trash2, Globe, Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CategoryIcon } from '../utilis/getCategoryIcon.jsx';
import { getInitials } from '../utilis/getInitials.js';
import { handleBookmark } from '../utilis/handleBookmark.js';

const GRID_TAG_LIMIT = 3;

function ResourceCardTags({ tags, isListView, showAllTags, onToggleShowAllTags }) {
  if (!tags?.length) return null;

  const visibleTags = isListView
    ? showAllTags
      ? tags
      : tags.slice(0, GRID_TAG_LIMIT)
    : showAllTags
      ? tags
      : tags.slice(0, GRID_TAG_LIMIT);
  const hiddenTagCount = tags.length - GRID_TAG_LIMIT;

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleTags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs hover:bg-amber-50 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <CategoryIcon category={tag} className="w-3 h-3 shrink-0" />
          <span>#{tag}</span>
        </span>
      ))}

      {!isListView && hiddenTagCount > 0 && !showAllTags && (
        <button
          type="button"
          onClick={onToggleShowAllTags}
          className="inline-flex items-center px-2.5 py-1 text-xs text-stone-500 hover:text-slate-700 transition-colors"
        >
          +{hiddenTagCount} more
        </button>
      )}

      {!isListView && showAllTags && hiddenTagCount > 0 && (
        <button
          type="button"
          onClick={onToggleShowAllTags}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-500 hover:text-slate-700 transition-colors"
        >
          <span>Show less</span>
          <ChevronUp className="w-3 h-3" />
        </button>
      )}

      {isListView && hiddenTagCount > 0 && (
        <button
          type="button"
          onClick={onToggleShowAllTags}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 hover:text-slate-800 transition-colors sm:hidden"
        >
          <span>{showAllTags ? 'Show less' : `+${hiddenTagCount} more`}</span>
          {showAllTags ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
}

export default function ResourceCard({
  resource,
  isListView = false,
  bookMarkedResourcesId = [],
  onBookmarkChange,
  showBookmark = true,
  showStatus = false,
  titleAsLink = false,
  ownerName,
  ownerSubtitle = 'Community Resource',
  showEdit = false,
  onDelete,
}) {
  const navigate = useNavigate();
  const isBookmarkedFromParent = bookMarkedResourcesId.includes(resource._id);
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedFromParent);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    setIsBookmarked(isBookmarkedFromParent);
  }, [isBookmarkedFromParent]);

  const description = resource.description?.trim();
  const primaryTag = resource.tags?.[0];
  const extraTagCount = Math.max((resource.tags?.length ?? 0) - 1, 0);
  const hasTopActions = showBookmark || showStatus;

  return (
    <article
      className={`group relative bg-white rounded-xl border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-lg ${
        isListView
          ? 'flex flex-col sm:flex-row sm:items-start p-5 sm:p-6 gap-4 sm:gap-6'
          : 'flex flex-col p-5 sm:p-6'
      }`}
    >
      {hasTopActions && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {showBookmark && (
            <button
              onClick={() =>
                handleBookmark(
                  resource._id,
                  setIsAnimating,
                  setIsBookmarked,
                  isBookmarked,
                  onBookmarkChange
                )
              }
              className={`p-2 rounded-lg transition-all duration-200 ${
                isBookmarked
                  ? 'bg-amber-50 text-slate-700'
                  : 'bg-stone-100 text-stone-400 hover:bg-amber-50 hover:text-slate-700'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
            >
              <Bookmark
                className={`w-4 h-4 transition-all duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}
                fill={isBookmarked ? 'currentColor' : 'none'}
                strokeWidth={2}
              />
            </button>
          )}

          {showStatus &&
            (resource.status === 'private' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium">
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline">Private</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-slate-800 rounded-md text-xs font-medium">
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">Public</span>
              </span>
            ))}
        </div>
      )}

      <div className={`flex flex-col gap-3 min-w-0 ${isListView ? 'flex-1' : ''} ${hasTopActions ? 'pr-12 sm:pr-28' : ''}`}>
        {primaryTag && (
          <div className="flex items-center gap-2">
            <span className="tag tag-primary">
              <CategoryIcon category={primaryTag} className="w-3 h-3" />
              <span>{primaryTag}</span>
            </span>
            {extraTagCount > 0 && <span className="text-xs text-stone-500">+{extraTagCount} more</span>}
          </div>
        )}

        <h3
          className="text-lg font-semibold text-stone-900 leading-snug line-clamp-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {titleAsLink ? (
            <a
              href={resource.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-700 transition-colors"
            >
              {resource.name}
            </a>
          ) : (
            resource.name
          )}
        </h3>

        {description && (
          <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">{description}</p>
        )}

        <ResourceCardTags
          tags={resource.tags}
          isListView={isListView}
          showAllTags={showAllTags}
          onToggleShowAllTags={() => setShowAllTags((prev) => !prev)}
        />
      </div>

      <div
        className={`flex shrink-0 ${
          isListView
            ? 'w-full sm:w-auto flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 sm:self-stretch sm:min-w-[220px]'
            : 'flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 mt-1 border-t border-stone-100'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">{getInitials(resource.email)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-800 truncate">{ownerName ?? resource.email}</p>
            <p className="text-xs text-stone-500">{ownerSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showEdit && (
            <button
              onClick={() => navigate(`/edit/${resource._id}`, { state: { resource } })}
              className="p-2 text-stone-400 hover:text-slate-700 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit Resource"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(resource)}
              className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <a
            href={resource.sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all duration-200 group/link"
          >
            <span>Visit</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
}
