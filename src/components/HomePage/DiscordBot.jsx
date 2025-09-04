import { 
  BookmarkPlus, 
  Bot, 
  Zap, 
  Star,
} from 'lucide-react';

const DiscordBot = () => {
  return (
    <>
          <section id="discord" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Coming Soon: Discord Bot Integration! 🤖
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              ResourceHub is just one part of our comprehensive Discord bot ecosystem. 
              Manage your entire digital life without leaving Discord!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <BookmarkPlus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Resource Manager</h3>
              <p className="text-gray-600">Save, organize, and share resources directly from Discord commands.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Expense Tracker</h3>
              <p className="text-gray-600">Track your spending and income without leaving your Discord server.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">More Services</h3>
              <p className="text-gray-600">Additional productivity tools and services coming to enhance your workflow.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DiscordBot