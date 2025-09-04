import { MessageSquare, Zap, Users, Star } from 'lucide-react';

const WhyRH = () => {
  return (
    <>
     <section id="why-us" className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8">Why ResourceHub Exists?</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Lost in WhatsApp Chaos</h3>
                    <p className="text-white/90">We've all been there - sharing an amazing resource in a group chat, only to lose it in the endless scroll of messages and memes.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Information Overload</h3>
                    <p className="text-white/90">The internet is full of valuable resources, but without proper organization, they become digital clutter that's impossible to find when needed.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Community Knowledge</h3>
                    <p className="text-white/90">Great resources should be shared! Our public resource feature lets you contribute to and benefit from community knowledge.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-yellow-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">The Solution</h3>
                  <p className="text-white/90">A centralized, organized, and searchable hub for all your valuable resources - accessible anywhere, anytime!</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-300">∞</div>
                    <div className="text-sm text-white/80">Resources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-300">⚡</div>
                    <div className="text-sm text-white/80">Fast Search</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-300">🔒</div>
                    <div className="text-sm text-white/80">Secure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-300">🌍</div>
                    <div className="text-sm text-white/80">Share</div>
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

export default WhyRH