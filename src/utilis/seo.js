export const SITE_NAME = 'ResourceHub';

export const SITE_URL = (import.meta.env.VITE_FRONTEND_URL || 'https://resources.lakshaymahajan.com').replace(/\/$/, '');

export const DEFAULT_OG_IMAGE = `${SITE_URL}/resourceManagerLogo.png`;

export const DEFAULT_DESCRIPTION =
  'Stop losing important resources in chat apps and scattered notes. ResourceHub gives you a single, organized space to save, find, and share your most valuable links.';

export const PUBLIC_ROUTES = {
  home: {
    path: '/',
    title: 'ResourceHub — Keep Every Resource That Matters in One Place',
    description: DEFAULT_DESCRIPTION,
  },
  publicResources: {
    path: '/publicResources',
    title: 'Public Resources — Discover Community Links | ResourceHub',
    description:
      'Browse public resources shared by the ResourceHub community. Find curated links, tools, and learning materials by category and tag.',
  },
  publicCollections: {
    path: '/collections/public',
    title: 'Public Collections — Curated Resource Lists | ResourceHub',
    description:
      'Explore public collections of resources organized by community members. Discover reading lists, learning paths, and themed link collections.',
  },
};

export const buildCanonicalUrl = (path = '/') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const buildPageTitle = (pageTitle, suffix = SITE_NAME) => {
  if (!pageTitle || pageTitle.includes(suffix)) return pageTitle;
  return `${pageTitle} | ${suffix}`;
};

const upsertMeta = (attribute, key, content) => {
  if (content == null || content === '') return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  if (!href) return;

  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const removeJsonLd = (id) => {
  document.getElementById(id)?.remove();
};

export const applyPageSeo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
  jsonLdId = 'page-json-ld',
}) => {
  const canonicalUrl = buildCanonicalUrl(path);

  document.title = title;
  document.documentElement.lang = 'en';

  upsertMeta('name', 'title', title);
  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:site_name', SITE_NAME);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);

  upsertLink('canonical', canonicalUrl);

  removeJsonLd(jsonLdId);
  if (jsonLd) {
    const script = document.createElement('script');
    script.id = jsonLdId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
};

export const getWebsiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/publicResources?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const getCollectionJsonLd = (collection, path) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: collection.name,
  description: collection.description || `Public collection on ${SITE_NAME}`,
  url: buildCanonicalUrl(path),
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  },
});
