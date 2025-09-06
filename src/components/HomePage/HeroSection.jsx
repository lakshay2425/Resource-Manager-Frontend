import { 
  Lock, 
  Unlock, 
  ArrowRight,
  Link
} from 'lucide-react';
import {useGoogleAuth} from "../../hooks/useGoogleOAuth.js"
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

const HeroSection = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useContext(AuthContext);
  const {handleGoogleLogin} = useGoogleAuth();
     return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 xl:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
              Never Lose Your
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block sm:inline"> Precious Resources </span>
              Again!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Tired of scrolling through endless WhatsApp chats to find that awesome link you shared? 
              Say goodbye to lost resources and hello to organized, accessible knowledge management! 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => isAuthenticated === true ? navigate("/createResource") : handleGoogleLogin()} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
              >
                {isAuthenticated ? "Create Resource" : "Start Organizing Now"}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </button>
              <button 
                onClick={() => navigate("/publicResources")} 
                className="border-2 border-purple-200 text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-purple-50 transition-colors w-full sm:w-auto"
              >
                Browse Public Resources
              </button>
            </div>
          </div>
          
          {/* Animated Resource Cards */}
          <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto lg:max-w-none">
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Link className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">React Tutorial</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Complete guide to React hooks</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Link className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <Unlock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Design System</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Modern UI components</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Link className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                    <Unlock className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">API Documentation</h3>
                  <p className="text-xs sm:text-sm text-gray-600">RESTful API best practices</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Link className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                    <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1">Personal Notes</h3>
                  <p className="text-xs sm:text-sm text-gray-600">My coding references</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection