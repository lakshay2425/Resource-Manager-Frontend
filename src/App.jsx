import { useEffect, useContext } from 'react'
import EditResource from "./pages/EditResource.jsx"
import ResourceCreationForm from './pages/createForm.jsx'
import Home from './pages/Home.jsx'
import PublicResources from "./pages/publicResources.jsx"
import Resource from "./pages/Resources.jsx"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RenderProtectedRoute from './utilis/renderProtectedRoute.jsx'
import { AuthContext } from './context/AuthContext.jsx'

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
  const {user, isAuthenticated} = useContext(AuthContext);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publicResources" element={<PublicResources />} />
        
        <Route 
        path="/createResource" 
        element={
          <RenderProtectedRoute
          condition={
            isAuthenticated === true && user != null
          }
          renderPage={<ResourceCreationForm />}
          fallback='/'
          errorMessage='You need to login to access this page'
           />
          } />

        <Route path='/resources' element={
          <RenderProtectedRoute
          condition={
            isAuthenticated === true && user != null
          }
          renderPage={<Resource />}
          fallback='/'
          errorMessage='You need to login to access this page'
          />
          }
          />

          <Route path='/edit/:id' element={
          <RenderProtectedRoute
          condition={
            isAuthenticated === true && user != null
          }
          renderPage={<EditResource />}
          fallback='/'
          errorMessage='You need to login to access this page'
          />
          }
          />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
