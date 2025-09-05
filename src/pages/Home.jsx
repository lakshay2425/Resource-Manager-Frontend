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
      <section id='features'>
      <Features />
      </section>

      {/* Why ResourceHub Section */}
     <section id='why-us'>
      <WhyRH />
     </section>

      {/* Discord Bot Section */}
      <section id='discord'>
        <DiscordBot/>
      </section>
    </div>
  );
}