import { 
  BookmarkPlus, 
  Bot, 
  Zap, 
  Star,
} from 'lucide-react';

const DiscordBot = () => {
  return (
    <section id="discord" className="py-12 sm:py-16 lg:py-20 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Bot className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Coming Soon: Discord Bot Integration!
            <span className="text-2xl sm:text-3xl"> 🤖</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-4 sm:px-0 leading-relaxed">
            ResourceHub is just one part of our comprehensive Discord bot ecosystem. 
            Manage your entire digital life without leaving Discord!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <BookmarkPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Resource Manager</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Save, organize, and share resources directly from Discord commands.
            </p>
          </div>

          <div className="text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Expense Tracker</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Track your spending and income without leaving your Discord server.
            </p>
          </div>

          <div className="text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 sm:col-span-2 md:col-span-1 sm:mx-auto md:mx-0 sm:max-w-sm md:max-w-none">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">More Services</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Additional productivity tools and services coming to enhance your workflow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscordBot;