import { motion } from "framer-motion";
import heroImg from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Beautiful farmland at sunrise" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <span className="inline-block bg-secondary/90 text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🌾 Empowering Farmers Everywhere
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-background leading-tight mb-6">
            Smart Farming for a{" "}
            <span className="text-secondary">Better Tomorrow</span>
          </h1>
          <p className="text-lg text-background/80 mb-8 max-w-xl">
            Access modern farming techniques, real-time crop information, market prices,
            weather updates, and expert agricultural advice — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#services"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-lg"
            >
              Explore Services
            </a>
            <a
              href="#crops"
              className="bg-background/20 backdrop-blur-sm text-background border border-background/30 px-8 py-3 rounded-lg font-medium hover:bg-background/30 transition-colors text-lg"
            >
              View Crops
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl"
        >
          {[
            { value: "10K+", label: "Farmers Helped" },
            { value: "500+", label: "Crop Varieties" },
            { value: "50+", label: "Expert Advisors" },
            { value: "24/7", label: "Weather Updates" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background/10 backdrop-blur-sm rounded-lg p-4 text-center border border-background/20">
              <div className="text-2xl font-bold text-secondary">{stat.value}</div>
              <div className="text-sm text-background/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
