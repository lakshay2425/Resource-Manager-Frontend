import HeroSection from '../components/HomePage/HeroSection.jsx';
import Features from '../components/HomePage/Features.jsx';
import WhyRH from '../components/HomePage/WhyRH.jsx';

export default function ResourceManagerLanding() {
  return (
    <main className="min-h-screen bg-stone-50">
      <HeroSection />

      <section id='features'>
        <Features />
      </section>

      <section id='why-us'>
        <WhyRH />
      </section>
    </main>
  );
}
