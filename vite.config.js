import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL || ''
  const backendOrigin = backendUrl.replace(/\/api\/?$/, '')

  const apiRuntimeCaching = backendOrigin
    ? [
        {
          urlPattern: ({ request, url }) =>
            request.method === 'GET' && url.href.startsWith(backendOrigin),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'resourcehub-api-cache',
            networkTimeoutSeconds: 8,
            expiration: {
              maxEntries: 80,
              maxAgeSeconds: 60 * 60 * 24,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ]
    : []

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['resourceManagerLogo.png', 'robots.txt', 'sitemap.xml', 'offline.html'],
        manifest: {
          name: 'ResourceHub',
          short_name: 'ResourceHub',
          description:
            'Keep every resource that matters in one place. Save, find, and share your most valuable links.',
          theme_color: '#1e293b',
          background_color: '#fafaf9',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/resourceManagerLogo.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/resourceManagerLogo.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/resourceManagerLogo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,txt,xml}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/offline\.html$/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            ...apiRuntimeCaching,
          ],
        },
      }),
    ],
    server: {
      allowedHosts: ['1e4122934a1c.ngrok-free.app'],
    },
  }
})
