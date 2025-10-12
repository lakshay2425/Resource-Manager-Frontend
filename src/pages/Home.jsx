import HeroSection from '../components/HomePage/HeroSection.jsx';
import Features from '../components/HomePage/Features.jsx';
import WhyRH from '../components/HomePage/WhyRH.jsx';

export default function ResourceManagerLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <HeroSection />

      <section id='features'>
      <Features />
      </section>

     <section id='why-us'>
      <WhyRH />
     </section>
    </div>
  );
}
