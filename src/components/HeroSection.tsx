import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Droplets, TrendingUp, ArrowRight, Sprout } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-14 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero-effect.mp4" type="video/mp4" />
      </video>
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[hsl(145,70%,20%,0.85)] via-[hsl(145,60%,25%,0.75)] to-[hsl(30,80%,40%,0.6)]" />

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-foreground/5 -mr-40 hidden md:block z-[2]" />
      <div className="absolute right-20 top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary-foreground/5 hidden md:block z-[2]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary-foreground/20">
              <Sprout className="w-4 h-4" />
              Smart Farming for Modern India
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Grow Smarter with{" "}
              <span className="text-secondary">Crop Wise</span>
            </h1>
            <p className="text-lg text-primary-foreground/75 mb-8 max-w-xl leading-relaxed">
              Your complete farming companion with AI-powered insights, real-time weather, market prices, and a vibrant community of farmers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/ai-assistant" className="btn-white">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/crops" className="btn-outline-white">
                Explore Crops
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex flex-col items-end gap-4"
          >
            <div className="flex gap-4">
              <div className="bg-primary-foreground/15 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-primary-foreground/20 animate-float">
                <Sun className="w-8 h-8 text-secondary mb-3" />
                <div className="text-2xl font-bold text-primary-foreground">32°C</div>
                <div className="text-sm text-primary-foreground/70">Sunny</div>
              </div>
              <div className="bg-primary-foreground/15 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-primary-foreground/20 animate-float" style={{ animationDelay: "0.5s" }}>
                <Droplets className="w-8 h-8 text-blue-300 mb-3" />
                <div className="text-2xl font-bold text-primary-foreground">65%</div>
                <div className="text-sm text-primary-foreground/70">Humidity</div>
              </div>
            </div>
            <div className="bg-primary-foreground/15 backdrop-blur-md rounded-2xl p-5 min-w-[200px] border border-primary-foreground/20 animate-float" style={{ animationDelay: "1s" }}>
              <TrendingUp className="w-8 h-8 text-emerald-300 mb-3" />
              <div className="text-2xl font-bold text-primary-foreground">₹2,450/qtl</div>
              <div className="text-sm text-primary-foreground/70">Wheat Price</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="hsl(0 0% 98%)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
