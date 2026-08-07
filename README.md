# ResourceHub 📚

> Never lose your precious resources again! A centralized resource link management platform that helps you organize, secure, and share your valuable links and knowledge with ease.

![ResourceHub](https://img.shields.io/badge/ResourceHub-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1+-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.0+-646CFF?logo=vite)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🌟 Features

### 🔐 **Smart Resource Management**

- **Fast Create Flow**: Add a resource with only a name and link; ownership comes from auth
- **Private by Default**: New resources are always created as private
- **Edit Enrichment**: Add description, tags, visibility, and update the URL on the edit page
- **Intelligent Tagging**: Organize resources with custom tags and predefined suggestions (on edit)
- **Advanced Search**: Find resources by name, description, or tags instantly
- **Category Filtering**: Browse resources by categories with visual icons
- **Resource Editing**: Full edit form prefilled with existing resource values

### 🎨 **Modern User Experience**

- **Responsive Design**: Beautiful, mobile-first interface with Tailwind CSS v4
- **Live Preview**: See how your resource will look while creating it
- **Dual View Modes**: Switch between grid and list views
- **Smooth Animations**: Engaging micro-interactions and transitions
- **Loading States**: Elegant loading screens and progress indicators
- **Toast Notifications**: Beautiful, non-intrusive user feedback

### 🔒 **Secure Authentication**

- **Google OAuth Integration**: Seamless login with your Google account
- **Protected Routes**: Secure access to private features with custom HOC
- **Session Management**: Cookie-based persistent authentication across browser sessions
- **User Profile Management**: Display user information and avatars

### 🌐 **Community Features**

- **Public Resource Discovery**: Browse amazing resources shared by the community
- **Resource Sharing**: Make your resources public to help others learn
- **User Profiles**: Track resource ownership and contributions

### ⚡ **Performance & Development**

- **Code Splitting**: Lazy loading of components for optimal performance
- **Hot Module Replacement**: Fast development with Vite HMR
- **ESLint Integration**: Code quality assurance and formatting
- **Docker Support**: Containerized deployment ready

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager
- **Backend API server** running (see backend documentation)
- **Docker** (optional, for containerized deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lakshay2425/resourceManager-frontend
   cd resourceManager-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   
   # For local development
   # VITE_BACKEND_URL=http://localhost:3000/api
   # VITE_AUTH_URL=http://localhost:5000/api
   
   # Frontend configuration
   VITE_FRONTEND_URL=http://localhost:4000
   
   # Google OAuth
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   
   # Development mode
   VITE_DEV_MODE=false
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🐳 Docker Deployment

ResourceHub comes with a complete Docker setup for easy deployment:

### **Build Docker Image**

```bash
# Build the Docker image
docker build -f Docker/Dockerfile -t resourcehub-frontend .
```

### **Run with Docker**

```bash
# Run the container
docker run -p 3000:3000 resourcehub-frontend
```

### **Multi-stage Build**

The Dockerfile uses a multi-stage build process:
- **Builder Stage**: Installs dependencies and builds the application
- **Production Stage**: Creates a lightweight production container with serve

### **Docker Configuration**

- **Base Image**: Node.js 24 Alpine (lightweight)
- **Security**: Runs as non-root user
- **Port**: Exposes port 3000
- **Serve**: Uses `serve` package to serve static files

## 🏗️ Tech Stack

### **Frontend Framework**

- **React 19.1**: Latest React with hooks and concurrent features
- **Vite 7.0**: Lightning-fast build tool and development server
- **React Router DOM v7**: Client-side routing and navigation

### **Styling & UI**

- **Tailwind CSS v4**: Latest utility-first CSS framework with new features
- **Lucide React**: Beautiful, customizable SVG icons
- **Custom Animations**: Smooth transitions and micro-interactions
- **Glassmorphism Design**: Modern aesthetic with backdrop blur effects

### **State Management**

- **React Context API**: Global state management for authentication and loading
- **React Hook Form**: Efficient form handling and validation
- **Custom Hooks**: Reusable logic for OAuth, local storage, navigation, and loading

### **Authentication & API**

- **Google OAuth (@react-oauth/google)**: Secure authentication flow
- **Axios**: HTTP client for API requests with interceptors
- **Protected Routes**: Route-level security implementation
- **Cookie-based Sessions**: Persistent authentication

### **Developer Experience**

- **React Hot Toast**: Beautiful toast notifications
- **ESLint v9**: Latest code linting and formatting
- **Lazy Loading**: Code-splitting for optimal performance
- **Suspense**: React Suspense for loading states

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── HomePage/           # Landing page specific components
│   │   ├── Features.jsx    # Features section
│   │   ├── HeroSection.jsx # Hero banner
│   │   └── WhyRH.jsx      # Why ResourceHub section
│   ├── BookmarkCard.jsx    # Bookmark list card
│   ├── Footer.jsx          # Application footer
│   ├── LoadingBar.jsx      # Loading spinner component
│   ├── LoadingScreen.jsx   # Full-screen loading component
│   └── Navbar.jsx          # Navigation header with auth
├── context/                # React Context providers
│   ├── AuthContext.jsx     # Authentication state management
│   └── LoadingContext.jsx  # Loading state management
├── hooks/                  # Custom React hooks
│   ├── useDocuments.js     # Document React Query hooks
│   ├── useGoogleOAuth.js   # Google OAuth integration
│   ├── useLocalStorage.js  # Local storage state sync
│   ├── useLoading.js       # Loading state hook
│   └── useNavigation.js    # Smooth scrolling navigation
├── pages/                  # Main application pages
│   ├── Home.jsx            # Landing page
│   ├── Resources.jsx       # User's resource management
│   ├── publicResources.jsx # Community resources
│   ├── CreateResource.jsx  # Create form (name + link only)
│   ├── EditResource.jsx    # Edit form (full fields, prefilled)
│   ├── BookmarkResources.jsx # User bookmarks
│   ├── DocumentManagement.jsx # Document upload/management
│   └── NotFound.jsx        # 404 error page
├── api/                    # API client helpers
│   └── documentApi.js      # Document / MinIO upload APIs
├── utilis/                 # Utility functions
│   ├── Axios.jsx           # API client configuration
│   ├── getCategoryColor.js # Tag color generation
│   ├── getCategoryIcon.jsx # Category icon mapping
│   ├── getInitials.js      # User avatar initials
│   ├── renderProtectedRoute.jsx # Route protection HOC
│   ├── scrollToTop.jsx     # Scroll to top utility
│   └── tagsFunction.js     # Tag manipulation utilities
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
└── index.css              # Global styles (Tailwind imports)

public/
├── resourceManagerLogo.png # Application logo
├── health                  # Docker / load-balancer health check (JSON)
├── llm.txt                 # LLM / AI crawler site summary
├── robots.txt              # Search engine crawl rules
└── sitemap.xml             # Static public URL sitemap

Docker/
└── Dockerfile            # Multi-stage Docker configuration
```

## 🛠️ Key Components

### **AuthContext**

Manages global authentication state and user session with cookie verification:

```jsx
const { isAuthenticated, gmail, setIsAuthenticated, isLoading } = useContext(AuthContext);
```

### **LoadingContext**

Manages application loading states:

```jsx
const { isLoading, setIsLoading } = useContext(LoadingContext);
```

### **Protected Routes**

Secure routes that require authentication with custom protection logic:

```jsx
<Route
  path="/resources"
  element={
    <RenderProtectedRoute
      condition={isAuthenticated === true}
      renderPage={<Resources />}
      fallback="/"
      errorMessage="You need to login to access this page"
    />
  }
/>
```

### **Resource Management**

Create and edit use **separate page components** (not one shared form):

| Page | Route | Component | Fields |
|------|-------|-----------|--------|
| Create | `/createResource` | `CreateResource.jsx` | `name`, `link` only |
| Edit | `/edit/:id` | `EditResource.jsx` | name, description, tags, status, `sourceLink` (prefilled) |

- **Create**: `POST /resources` with `{ name, link }` — no `email` in body (owner from auth cookie); server always creates as `private`
- **Edit**: `PATCH /resources/:id` with `{ updatedFields: { ... } }` — use `sourceLink` (not `link`) for URL updates
- Delete resources with confirmation modals
- Filter and search (handles missing description / empty tags)
- Tag-based organization on the edit flow

### **Create vs Edit API shapes**

```js
// CREATE — CreateResource.jsx
// POST /api/resources
{ name: string /* min 5 */, link: string /* valid URL → stored as sourceLink */ }

// UPDATE — EditResource.jsx
// PATCH /api/resources/:id
{
  updatedFields: {
    name?: string,          // min 5
    description?: string,   // min 10 when present
    tags?: string[],
    status?: "public" | "private",
    sourceLink?: string     // valid URL
  }
}
```

**Field name trap:** create uses `link`; GET responses and PATCH use `sourceLink`.

### **Google OAuth Integration**

Seamless authentication flow with error handling:

```jsx
const { handleGoogleLogin } = useGoogleAuth();
```

## 🎨 Styling Philosophy

ResourceHub uses a modern, glassmorphism-inspired design with:

- **Color Palette**: Purple and blue gradients with clean whites and glass effects
- **Typography**: Bold headings with readable body text using system fonts
- **Spacing**: Generous whitespace and consistent padding following 8px grid
- **Animations**: Subtle hover effects, smooth transitions, and micro-interactions
- **Responsive**: Mobile-first design with breakpoint optimization
- **Accessibility**: Focus states and keyboard navigation support

## 🔍 SEO & Discoverability

ResourceHub ships with first-class SEO for **public pages** and blocks indexing of authenticated areas.

### Public indexable routes

| Route | Page | Meta tags |
| ----- | ---- | --------- |
| `/` | Landing | Title, description, Open Graph, Twitter Card, WebSite JSON-LD |
| `/publicResources` | Community resources | Per-page title & description |
| `/collections/public` | Public collections browse | Per-page title & description |
| `/collections/:username/:slug` | Public collection detail | Dynamic title, description, CollectionPage JSON-LD; `noindex` when private |

Per-route metadata is applied at runtime via `usePageSeo` (`src/hooks/usePageSeo.js`) and `src/utilis/seo.js`.

Set `VITE_FRONTEND_URL` in `.env` so canonical URLs, Open Graph links, and sitemap entries match your deployment domain.

### Static SEO files (`public/`)

| File | URL | Purpose |
| ---- | --- | ------- |
| `sitemap.xml` | `/sitemap.xml` | Static sitemap for public landing pages |
| `robots.txt` | `/robots.txt` | Allow public routes; disallow auth-only paths |
| `llm.txt` | `/llm.txt` | Machine-readable site summary for LLM crawlers |
| `health` | `/health` | JSON health check for Docker / probes |

### Crawl rules (`robots.txt`)

- **Allowed**: `/`, `/publicResources`, `/collections/public`, `/collections/*/*` (public collection detail)
- **Disallowed**: `/resources`, `/bookmarks`, `/createResource`, `/edit/`, `/documents`, `/collections/new`, `/collections` (owner list)

Dynamic public collection URLs are discoverable via on-page links and client-side meta tags; add them to `sitemap.xml` manually or via a build-time script if you need full sitemap coverage.

### Notes for SPAs

Search engines that execute JavaScript will read updated `<title>`, meta, and JSON-LD after navigation. The base tags in `index.html` provide a fallback for the home page before hydration.

## 🔧 Configuration

### **Environment Variables**

| Variable                | Description                    | Example                                     |
| ----------------------- | ------------------------------ | ------------------------------------------- |
| `VITE_BACKEND_URL`      | Backend API base URL           | `https://localhost:3000/api/` |
| `VITE_AUTH_URL`         | Authentication service URL     | `https://localhost:5000/api` |
| `VITE_FRONTEND_URL`     | Frontend URL for redirects     | `http://localhost:4000`                     |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID         | `your-client-id.apps.googleusercontent.com` |
| `VITE_DEV_MODE`         | Development mode flag          | `false`                                     |

### **Build Configuration**

The project uses Vite with optimized settings for:

- **Fast HMR**: Hot Module Replacement for instant updates
- **Code Splitting**: Automatic chunking for optimal loading
- **Production Builds**: Minification and optimization
- **Modern Syntax**: ES2020+ with modern browser support
- **Tailwind Integration**: Built-in Tailwind CSS plugin

### **ESLint Configuration**

- **Modern ESLint**: Uses flat config format
- **React Rules**: React hooks and refresh plugins
- **Custom Rules**: Unused vars handling with pattern matching
- **Browser Globals**: Configured for browser environment

## 📱 Features in Detail

### **Resource Creation** (`CreateResource.jsx`)

Dedicated create form — **not** the edit form reused with empty values:

- **Fields**: Resource name + URL (`link`) only
- **Validation**: Name ≥ 5 characters; link must be a valid URL
- **Privacy**: Always created as private (no visibility picker on create)
- **Ownership**: Taken from the auth cookie — do not send `email` in the body
- **Live Preview**: Shows name/link preview marked as private
- **Success State**: Navigate to My Resources or create another
- **Enrich later**: Description, tags, and public/private are set on the edit page

### **Resource Editing** (`EditResource.jsx`)

Separate full form, opened with existing resource values via router state:

- Prefills name, description, tags, status, and `sourceLink`
- Client validation aligned with backend PATCH rules
- Maps the URL field to **`sourceLink`** in the PATCH body
- Optional description (min 10 characters when provided)
- Visibility toggle and tag management

### **Resource Discovery**

- **Smart Search**: Search across names, descriptions, and tags (safe when description/tags are missing)
- **Category Filtering**: Filter by resource categories with visual indicators
- **Sorting Options**: Sort by date, alphabetically, or relevance
- **View Modes**: Toggle between grid and list views with animations
- **Empty-field resilience**: Placeholders when description is missing; empty tags treated as `[]`

### **User Experience**

- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Loading States**: Skeleton screens and elegant loading animations
- **Error Handling**: Friendly error messages with recovery options
- **Toast Notifications**: Non-intrusive feedback system
- **Keyboard Navigation**: Full keyboard accessibility support

### **Performance Optimizations**

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Optimized images and lazy loading
- **Bundle Splitting**: Automatic code splitting by routes
- **Caching**: HTTP caching for API requests

## 🚀 Deployment Options

### **Build for Production**

```bash
npm run build
# or
yarn build
```

### **Preview Production Build**

```bash
npm run preview
# or
yarn preview
```

### **Deploy to Vercel**

```bash
npm install -g vercel
vercel --prod
```

### **Deploy to Netlify**

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### **Docker Deployment**

```bash
# Build and run with Docker
docker build -f Docker/Dockerfile -t resourcehub-frontend .
docker run -p 3000:3000 resourcehub-frontend
```

### **Production Environment Setup**

For production deployment, ensure:

1. **Environment Variables**: Set all required production URLs
2. **SSL/HTTPS**: Configure HTTPS for secure authentication
3. **CORS**: Configure backend CORS for your domain
4. **OAuth**: Update Google OAuth settings with production domains

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**

- Follow the existing code style and conventions
- Use TypeScript for new components when possible
- Write meaningful commit messages following conventional commits
- Test your changes thoroughly across different devices
- Update documentation when needed
- Ensure all linting passes before submitting

### **Code Style**

- Use functional components with hooks
- Prefer named exports over default exports
- Use descriptive variable and function names
- Keep components small and focused
- Extract reusable logic into custom hooks

## 📜 Available Scripts

| Script               | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start development server       |
| `npm run build`      | Build for production           |
| `npm run preview`    | Preview production build       |
| `npm run lint`       | Run ESLint                     |

## 🐛 Troubleshooting

### **Common Issues**

**OAuth not working:**

- Check if `VITE_GOOGLE_CLIENT_ID` is correctly set
- Ensure OAuth is configured in Google Console with correct redirect URIs
- Verify that you're using HTTPS in production
- Check browser console for OAuth errors

**API requests failing:**

- Verify backend server is running and accessible
- Check if `VITE_BACKEND_URL` and `VITE_AUTH_URL` point to correct endpoints
- Look for CORS errors in browser console
- Ensure cookies are being sent with `withCredentials: true`

**Build errors:**

- Clear `node_modules` and reinstall dependencies
- Ensure all environment variables are set correctly
- Check for any TypeScript errors if using TypeScript
- Verify that all imports are correct

**Docker issues:**

- Ensure Docker is running
- Check if port 3000 is available
- Verify the Dockerfile path is correct
- Check Docker logs for specific error messages

**Loading/Authentication issues:**

- Clear browser cookies and local storage
- Check network requests for authentication endpoints
- Verify backend authentication service is running
- Ensure proper session cookie configuration

## 🔒 Security Features

- **Route Protection**: HOC-based route protection
- **Session Validation**: Server-side session verification
- **CSRF Protection**: Cookie-based session security
- **Input Validation**: Form validation on both client and server
- **Context Menu Disabled**: Right-click and key shortcuts disabled in production

## 📊 Performance Metrics

- **Lighthouse Score**: 90+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized chunks under 500KB
- **Core Web Vitals**: Meets Google's recommended thresholds

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the developer community
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Authentication via [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- Deployed with [Docker](https://www.docker.com/)

---

**ResourceHub** - Your centralized resource management platform! 🚀

For questions, support, or contributions, please:
- 📧 Email: lakshay12290@gmail.com
- 🐛 Issues: Open an issue on GitHub
- 💬 Discussion: Start a GitHub Discussion

*Never lose your precious resources again!*
