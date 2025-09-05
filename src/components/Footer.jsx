import { 
  BookmarkPlus, 
} from 'lucide-react';
import useSectionNavigation from '../hooks/useNavigation.js';
const Footer = () => {
    const navigateToSection = useSectionNavigation();
  return (
    <>
          <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BookmarkPlus className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ResourceHub</span>
              </div>
              <p className="text-gray-400">
                Never lose your precious resources again. Organize, secure, and share your valuable links and knowledge with ease.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={()=> navigateToSection("features")} className="text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={()=> navigateToSection("why-us")} className="text-gray-400 hover:text-white transition-colors">Why ResourceHub?</button></li>
                <li><button onClick={()=> navigateToSection("discord")} className="text-gray-400 hover:text-white transition-colors">Discord Bot</button></li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 ResourceHub. Built with ❤️ for resource management.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer