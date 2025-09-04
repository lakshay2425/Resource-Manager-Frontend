import { 
  BookmarkPlus, 
  Search, 
  Edit3,
  Shield, 
} from 'lucide-react';

const Features = () => {
  return (
    <>
          <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, powerful tools to organize, secure, and share your valuable resources
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                <BookmarkPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Create & Store</h3>
              <p className="text-gray-600">Easily add new resources with links, names, and descriptions. Never lose track again!</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Find Instantly</h3>
              <p className="text-gray-600">Powerful search and filtering to locate any resource in seconds, not scroll sessions!</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy Control</h3>
              <p className="text-gray-600">Toggle between public and private. Share what you want, keep personal stuff secure.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-100">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-6">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Full CRUD</h3>
              <p className="text-gray-600">Create, read, update, delete - complete control over your resource collection.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Features