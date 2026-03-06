import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedTools } from '@/components/FeaturedTools';
import { FeaturesSection } from '@/components/FeaturesSection';
import { SEOHead } from '@/components/SEOHead';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ESPECTRO FEDERAL",
          "url": "https://espectrofederal.lovable.app",
          "description": "Premium cybersecurity tools for ethical hacking professionals",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://espectrofederal.lovable.app/tools?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedTools />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
