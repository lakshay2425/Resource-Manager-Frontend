import { 
  BookmarkPlus, 
  Search, 
  Shield, 
} from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Everything You Need to Manage Resources
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Simple, powerful tools to organize, secure, and share your valuable resources
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <BookmarkPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Create & Store</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Easily add new resources with links, names, and descriptions. Never lose track again!
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Find Instantly</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Powerful search and filtering to locate any resource in seconds, not scroll sessions!
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Privacy Control</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Toggle between public and private. Share what you want, keep personal stuff secure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features
