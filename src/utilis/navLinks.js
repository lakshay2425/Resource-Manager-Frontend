import {
  Home,
  FolderOpen,
  Layers,
  Bookmark,
  FileText,
  PlusCircle,
} from 'lucide-react';

export const discoverLinks = [
  {
    href: '/publicResources',
    label: 'Community resources',
    icon: Home,
    description: 'Browse community resources',
  },
  {
    href: '/collections/public',
    label: 'Public collections',
    icon: FolderOpen,
    description: 'Browse public collections',
  },
];

export const myLibraryLinks = [
  {
    href: '/resources',
    label: 'My resources',
    icon: Layers,
    description: 'View and manage your resources',
  },
  {
    href: '/collections',
    label: 'My collections',
    icon: FolderOpen,
    description: 'Organize resources into collections',
  },
  {
    href: '/bookmarks',
    label: 'Saved bookmarks',
    icon: Bookmark,
    description: 'View your saved bookmarks',
  },
  {
    href: '/documents',
    label: 'Documents',
    icon: FileText,
    description: 'Manage your uploaded documents',
  },
];

export const myLibraryFooterLinks = [
  ...myLibraryLinks,
  {
    href: '/createResource',
    label: 'Add a resource',
    icon: PlusCircle,
    description: 'Create a new resource',
  },
];

export function isNavLinkActive(pathname, href) {
  if (href === '/collections') {
    return (
      pathname === '/collections' ||
      pathname === '/collections/new'
    );
  }
  return pathname === href;
}

export function isNavGroupActive(pathname, links) {
  return links.some((link) => isNavLinkActive(pathname, link.href));
}
