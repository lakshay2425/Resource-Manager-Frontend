# ResourceHub 📚

> Never lose your precious resources again! A centralized resource link management platform that helps you organize, secure, and share your valuable links and knowledge with ease.

![ResourceHub](https://img.shields.io/badge/ResourceHub-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🌟 Features

### 🔐 **Smart Resource Management**

- **Private & Public Resources**: Control who can see your resources with privacy settings
- **Intelligent Tagging**: Organize resources with custom tags and auto-suggestions
- **Advanced Search**: Find resources by name, description, or tags instantly
- **Category Filtering**: Browse resources by categories with visual icons

### 🎨 **Modern User Experience**

- **Responsive Design**: Beautiful, mobile-first interface with Tailwind CSS
- **Live Preview**: See how your resource will look while creating it
- **Dual View Modes**: Switch between grid and list views
- **Smooth Animations**: Engaging micro-interactions and transitions

### 🔒 **Secure Authentication**

- **Google OAuth Integration**: Seamless login with your Google account
- **Protected Routes**: Secure access to private features
- **Session Management**: Persistent authentication across browser sessions

### 🌐 **Community Features**

- **Public Resource Discovery**: Browse amazing resources shared by the community
- **Resource Sharing**: Make your resources public to help others learn
- **User Profiles**: Track resource ownership and contributions

## 🚀 Quick Start

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager
- Backend API server running (see backend documentation)

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
   VITE_BACKEND_URL=http://localhost:3000/api
   VITE_AUTH_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 🏗️ Tech Stack

### **Frontend Framework**

- **React 18**: Modern React with hooks and functional components
- **Vite**: Lightning-fast build tool and development server
- **React Router DOM**: Client-side routing and navigation

### **Styling & UI**

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable SVG icons
- **Custom Animations**: Smooth transitions and micro-interactions

### **State Management**

- **React Context API**: Global state management for authentication
- **React Hook Form**: Efficient form handling and validation
- **Custom Hooks**: Reusable logic for OAuth, local storage, and navigation

### **Authentication & API**

- **Google OAuth (@react-oauth/google)**: Secure authentication flow
- **Axios**: HTTP client for API requests
- **Protected Routes**: Route-level security implementation

### **Developer Experience**

- **React Hot Toast**: Beautiful toast notifications
- **ESLint**: Code linting and formatting
- **Lazy Loading**: Code-splitting for optimal performance

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── HomePage/        # Landing page components
│   ├── Footer.jsx       # Application footer
│   ├── LoadingBar.jsx   # Loading spinner component
│   └── Navbar.jsx       # Navigation header
├── context/             # React Context providers
│   └── AuthContext.jsx  # Authentication state management
├── hooks/               # Custom React hooks
│   ├── useGoogleOAuth.js    # Google OAuth integration
│   ├── useLocalStorage.js   # Local storage state sync
│   └── useNavigation.js     # Smooth scrolling navigation
├── pages/               # Main application pages
│   ├── Home.jsx         # Landing page
│   ├── Resources.jsx    # User's resource management
│   ├── publicResources.jsx # Community resources
│   ├── createForm.jsx   # Resource creation form
│   ├── EditResource.jsx # Resource editing interface
│   └── NotFound.jsx     # 404 error page
├── utilis/              # Utility functions
│   ├── Axios.jsx        # API client configuration
│   ├── getCategoryColor.js # Tag color generation
│   ├── getCategoryIcon.jsx # Category icon mapping
│   ├── getInitials.js   # User avatar initials
│   └── renderProtectedRoute.jsx # Route protection HOC
└── App.jsx              # Main application component
```

## 🛠️ Key Components

### **AuthContext**

Manages global authentication state and user session:

```jsx
const { isAuthenticated, gmail, setIsAuthenticated } = useContext(AuthContext);
```

### **Protected Routes**

Secure routes that require authentication:

```jsx
<Route
  path="/resources"
  element={
    <RenderProtectedRoute
      condition={isAuthenticated}
      renderPage={<Resources />}
      fallback="/"
      errorMessage="You need to login to access this page"
    />
  }
/>
```

### **Resource Management**

Full CRUD operations for resources with real-time updates:

- Create new resources with live preview
- Edit existing resources with dirty field tracking
- Delete resources with confirmation
- Filter and search capabilities

## 🎨 Styling Philosophy

ResourceHub uses a modern, glassmorphism-inspired design with:

- **Color Palette**: Purple and blue gradients with clean whites
- **Typography**: Bold headings with readable body text
- **Spacing**: Generous whitespace and consistent padding
- **Animations**: Subtle hover effects and smooth transitions
- **Responsive**: Mobile-first design with breakpoint optimization

## 🔧 Configuration

### **Environment Variables**

| Variable                | Description                | Example                                     |
| ----------------------- | -------------------------- | ------------------------------------------- |
| `VITE_BACKEND_URL`      | Backend API base URL       | `http://localhost:3000/api`                 |
| `VITE_AUTH_URL`         | Authentication service URL | `http://localhost:5000/api`                 |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID     | `your-client-id.apps.googleusercontent.com` |

### **Build Configuration**

The project uses Vite with optimized settings for:

- Fast HMR (Hot Module Replacement)
- Efficient code splitting
- Optimized production builds
- Modern browser support

## 📱 Features in Detail

### **Resource Creation**

- **Live Preview**: See your resource card as you type
- **Tag Suggestions**: Auto-complete with popular tags
- **URL Validation**: Real-time link validation
- **Privacy Controls**: Choose between private and public visibility

### **Resource Discovery**

- **Smart Search**: Search across names, descriptions, and tags
- **Category Filtering**: Filter by resource categories
- **Sorting Options**: Sort by date or alphabetically
- **View Modes**: Toggle between grid and list views

### **User Experience**

- **Responsive Design**: Works perfectly on all devices
- **Loading States**: Elegant loading animations
- **Error Handling**: Friendly error messages and fallbacks
<!-- - **Keyboard Navigation**: Full keyboard accessibility -->

## 🚀 Deployment

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
vercel
```

### **Deploy to Netlify**

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow the existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation when needed

## 📜 Available Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint               |
| `npm run lint:fix` | Fix ESLint errors        |

## 🐛 Troubleshooting

### **Common Issues**

**OAuth not working:**

- Check if `VITE_GOOGLE_CLIENT_ID` is correctly set
- Ensure OAuth is configured in Google Console
- Verify redirect URLs are whitelisted

**API requests failing:**

- Check if backend server is running
- Verify `VITE_BACKEND_URL` points to correct endpoint
- Check browser console for CORS errors

**Build errors:**

- Clear node_modules and reinstall dependencies
- Check for TypeScript errors in newer components
- Verify all environment variables are set

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for resource management
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)

---

**ResourceHub** - Never lose your precious resources again! 🚀

For questions or support, please open an issue or contact the maintainers at lakshay12290@gmail.com.
