import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedTools } from '@/components/FeaturedTools';
import { FeaturesSection } from '@/components/FeaturesSection';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
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
