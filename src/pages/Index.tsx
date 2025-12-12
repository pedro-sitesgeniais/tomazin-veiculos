import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedVehicles } from '@/components/FeaturedVehicles';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { EvaluateVehicle } from '@/components/EvaluateVehicle';
import { Testimonials } from '@/components/Testimonials';
import { Location } from '@/components/Location';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedVehicles />
      <WhyChooseUs />
      <EvaluateVehicle />
      <Testimonials />
      <Location />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
