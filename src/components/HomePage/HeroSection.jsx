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
    <>
        <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Never Lose Your
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Precious Resources </span>
                Again!
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tired of scrolling through endless WhatsApp chats to find that awesome link you shared? 
                Say goodbye to lost resources and hello to organized, accessible knowledge management! 🚀
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={()=> isAuthenticated === true ? handleGoogleLogin : navigate("/resources")  } className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  Start Organizing Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button onClick={()=> navigate("/publicResources")} className="border-2 border-purple-200 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-colors">
                  Browse Public Resources
                </button>
              </div>
            </div>
            
            {/* Animated Resource Cards */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Link className="w-5 h-5 text-blue-500" />
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800">React Tutorial</h3>
                    <p className="text-sm text-gray-600">Complete guide to React hooks</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Link className="w-5 h-5 text-green-500" />
                      <Unlock className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Design System</h3>
                    <p className="text-sm text-gray-600">Modern UI components</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Link className="w-5 h-5 text-purple-500" />
                      <Unlock className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-gray-800">API Documentation</h3>
                    <p className="text-sm text-gray-600">RESTful API best practices</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Link className="w-5 h-5 text-orange-500" />
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Personal Notes</h3>
                    <p className="text-sm text-gray-600">My coding references</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HeroSection