import { useEffect, useContext, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthContext } from './context/AuthContext.jsx'
import Offline from './pages/Offline.jsx'
import RouteErrorBoundary from './components/RouteErrorBoundary.jsx'
import { lazyWithOfflineFallback, registerOfflineChunkHandler } from './utilis/lazyWithOfflineFallback.js'

const EditResource = lazyWithOfflineFallback(() => import('./pages/EditResource.jsx'))
const ResourceCreationForm = lazyWithOfflineFallback(() => import('./pages/CreateResource.jsx'))
const Home = lazyWithOfflineFallback(() => import('./pages/Home.jsx'))
const PublicResources = lazyWithOfflineFallback(() => import('./pages/publicResources.jsx'))
const Resource = lazyWithOfflineFallback(() => import('./pages/Resources.jsx'))
const RenderProtectedRoute = lazyWithOfflineFallback(() => import('./utilis/renderProtectedRoute.jsx'))
const Navbar = lazyWithOfflineFallback(() => import('./components/Navbar.jsx'))
const Footer = lazyWithOfflineFallback(() => import('./components/Footer.jsx'))
const ScrollToTop = lazyWithOfflineFallback(() => import('./utilis/scrollToTop.jsx'))
const NotFound = lazyWithOfflineFallback(() => import('./pages/NotFound.jsx'))
const Spinner = lazyWithOfflineFallback(() => import('./components/LoadingBar.jsx'))
const LoadingScreen = lazyWithOfflineFallback(() => import('./components/LoadingScreen.jsx'))
const OfflineBanner = lazyWithOfflineFallback(() => import('./components/OfflineBanner.jsx'))
const InstallPrompt = lazyWithOfflineFallback(() => import('./components/InstallPrompt.jsx'))
const Bookmark = lazyWithOfflineFallback(() => import('./pages/BookmarkResources.jsx'))
const DocumentManagement = lazyWithOfflineFallback(() => import('./pages/DocumentManagement.jsx'))
const MyCollections = lazyWithOfflineFallback(() => import('./pages/MyCollections.jsx'))
const PublicCollections = lazyWithOfflineFallback(() => import('./pages/PublicCollections.jsx'))
const CreateCollection = lazyWithOfflineFallback(() => import('./pages/CreateCollection.jsx'))
const CollectionDetail = lazyWithOfflineFallback(() => import('./pages/CollectionDetail.jsx'))

function App() {
  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 's')) {
        preventDefault(e);
      }
    };

    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => registerOfflineChunkHandler(), []);

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <LoadingScreen>
        <OfflineBanner />
        <Navbar />
        <ScrollToTop />
        <RouteErrorBoundary>
          <Suspense fallback={<Spinner message={'Loading Resources...'} />}>
            <Routes>
              <Route path="/offline" element={<Offline />} />
              <Route path="/" element={<Home />} />
              <Route path="/publicResources" element={<PublicResources />} />
              <Route
                path="/bookmarks"
                element={
                  <RenderProtectedRoute
                    fallback="/"
                    condition={isAuthenticated}
                    renderPage={<Bookmark />}
                  />
                }
              />
              <Route
                path="/createResource"
                element={
                  <RenderProtectedRoute
                    condition={isAuthenticated}
                    renderPage={<ResourceCreationForm />}
                    fallback="/"
                    errorMessage="You need to login to access this page"
                  />
                }
              />

              <Route
                path="/resources"
                element={
                  <RenderProtectedRoute
                    condition={isAuthenticated}
                    renderPage={<Resource />}
                    fallback="/"
                    errorMessage="You need to login to access this page"
                  />
                }
              />

              <Route
                path="/edit/:id"
                element={
                  <RenderProtectedRoute
                    condition={isAuthenticated}
                    renderPage={<EditResource />}
                    fallback="/"
                    errorMessage="You need to login to access this page"
                  />
                }
              />
              <Route
                path="/documents"
                element={
                  <RenderProtectedRoute
                    condition={isAuthenticated}
                    renderPage={<DocumentManagement />}
                    fallback="/"
                    errorMessage="You need to login to access this page"
                  />
                }
              />
              <Route path="/collections/public" element={<PublicCollections />} />
              <Route
                path="/collections/new"
                element={
                  <RenderProtectedRoute
                    condition={isAuthenticated}
                    renderPage={<CreateCollection />}
                    fallback="/"
                    errorMessage="You need to login to access this page"
                  />
                }
              />
              <Route path="/collections/:username/:slug" element={<CollectionDetail />} />
              <Route
                path="/collections"
                element={
                  <RenderProtectedRoute
                    condition={isAuthenticated}
                    renderPage={<MyCollections />}
                    fallback="/"
                    errorMessage="You need to login to access this page"
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
        <Footer />
        <InstallPrompt />
      </LoadingScreen>
    </>
  );
}

export default App
