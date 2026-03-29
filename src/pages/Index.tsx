import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import CropsSection from "@/components/CropsSection";
import TipsSection from "@/components/TipsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <CropsSection />
      <TipsSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
