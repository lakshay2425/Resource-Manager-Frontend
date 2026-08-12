import React from 'react';
import { CategoryIcon } from '../utilis/getCategoryIcon.jsx';

export default function TagBadge({ category, className = '', absolute = false, ariaLabel }) {
  return (
    <div className={absolute ? 'absolute top-4 right-4' : ''}>
      <span className={`tag tag-primary ${className}`} aria-label={ariaLabel ?? category}>
        <CategoryIcon category={category} className="w-3 h-3 shrink-0" />
        <span>{category}</span>
      </span>
    </div>
  );
}
