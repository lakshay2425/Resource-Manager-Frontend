import HeroSection from '../components/HomePage/HeroSection.jsx';
import Features from '../components/HomePage/Features.jsx';
import WhyRH from '../components/HomePage/WhyRH.jsx';
import DiscordBot from '../components/HomePage/DiscordBot.jsx';

export default function ResourceManagerLanding() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* Why ResourceHub Section */}
      <WhyRH />

      {/* Discord Bot Section */}
        <DiscordBot/>
    </div>
  );
}