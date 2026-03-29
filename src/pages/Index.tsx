import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import ServicesSection from "@/components/ServicesSection";
import WeatherSection from "@/components/WeatherSection";
import MarketPricesSection from "@/components/MarketPricesSection";
import CropsSection from "@/components/CropsSection";
import CommunitySection from "@/components/CommunitySection";
import LearningSection from "@/components/LearningSection";
import SchemesSection from "@/components/SchemesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <WeatherSection />
      <MarketPricesSection />
      <CropsSection />
      <CommunitySection />
      <LearningSection />
      <SchemesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
