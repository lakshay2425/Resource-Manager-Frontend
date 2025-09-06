import { useEffect, useContext , Suspense, lazy} from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthContext } from './context/AuthContext.jsx'
const EditResource = lazy(()=> import("./pages/EditResource.jsx"))
const ResourceCreationForm = lazy(()=> import("./pages/createForm.jsx"))
const Home = lazy(()=> import("./pages/Home.jsx"))
const PublicResources =  lazy(()=> import("./pages/publicResources.jsx"))
const Resource = lazy(()=> import("./pages/Resources.jsx"))
const RenderProtectedRoute = lazy(()=> import("./utilis/renderProtectedRoute.jsx"))
const Navbar = lazy(()=> import("./components/Navbar.jsx"))
const Footer = lazy(()=> import("./components/Footer.jsx"))
const ScrollToTop = lazy(()=> import('./utilis/scrollToTop.jsx'))
const NotFound = lazy(()=> import("./pages/NotFound.jsx"))
const Spinner = lazy(()=> import("./components/LoadingBar.jsx"))
const LoadingScreen = lazy(()=> import("./components/LoadingScreen.jsx"))

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
  const {isAuthenticated} = useContext(AuthContext);

  return (
    <>
    <LoadingScreen>
    <Navbar/>
    <ScrollToTop/>
    <Suspense fallback={<Spinner message={"Loading Resources..."}/>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publicResources" element={<PublicResources />} />
        
        <Route 
        path="/createResource" 
        element={
          <RenderProtectedRoute
          condition={isAuthenticated === true}
          renderPage={<ResourceCreationForm />}
          fallback='/'
          
          errorMessage='You need to login to access this page'
          />
        } />

        <Route path='/resources' element={
          <RenderProtectedRoute
          condition={isAuthenticated === true}
          renderPage={<Resource />}
          fallback='/'
          errorMessage='You need to login to access this page'
          />
        }
        />

          <Route path='/edit/:id' element={
            <RenderProtectedRoute
            condition={isAuthenticated === true}
            renderPage={<EditResource />}
            fallback='/'
            errorMessage='You need to login to access this page'
            />
          }
          />
          <Route path='*' element={<NotFound/>}/>
      </Routes>
      </Suspense>
    <Footer/>
      </LoadingScreen>
    </>
  )
}

export default App
