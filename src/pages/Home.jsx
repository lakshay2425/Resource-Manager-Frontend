import HeroSection from '../components/HomePage/HeroSection.jsx';
import Features from '../components/HomePage/Features.jsx';
import WhyRH from '../components/HomePage/WhyRH.jsx';
import { usePageSeo } from '../hooks/usePageSeo.js';
import { PUBLIC_ROUTES, getWebsiteJsonLd } from '../utilis/seo.js';

export default function ResourceManagerLanding() {
  usePageSeo({
    ...PUBLIC_ROUTES.home,
    jsonLd: getWebsiteJsonLd(),
  });

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
