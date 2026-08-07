import { useEffect } from 'react';
import { applyPageSeo } from '../utilis/seo.js';

export const usePageSeo = (config) => {
  useEffect(() => {
    if (!config) return undefined;

    applyPageSeo(config);

    return () => {
      document.getElementById(config.jsonLdId ?? 'page-json-ld')?.remove();
    };
  }, [
    config?.title,
    config?.description,
    config?.path,
    config?.image,
    config?.type,
    config?.noindex,
    config?.jsonLdId,
    config ? JSON.stringify(config.jsonLd ?? null) : null,
  ]);
};
