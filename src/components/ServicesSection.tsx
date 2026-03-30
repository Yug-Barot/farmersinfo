import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CloudSun, TrendingUp, Sprout, MessageSquare, Users, Calendar } from "lucide-react";

const services = [
  { icon: CloudSun, title: "Weather Forecasts", description: "Get accurate 7-day weather forecasts and farming advisories tailored to your location.", to: "/weather", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: TrendingUp, title: "Market Prices", description: "Track real-time mandi prices across India and find the best markets for your produce.", to: "/market-prices", color: "text-primary", bg: "bg-accent" },
  { icon: Sprout, title: "Crop Guide", description: "Comprehensive information on 20+ crops including soil requirements, climate, and seasons.", to: "/crops", color: "text-primary", bg: "bg-accent" },
  { icon: MessageSquare, title: "AI Farm Assistant", description: "Get instant answers to your farming questions from our intelligent AI assistant.", to: "/ai-assistant", color: "text-violet-500", bg: "bg-violet-50" },
  { icon: Users, title: "Community Hub", description: "Connect with farmers, share success stories, and learn from experienced agriculturists.", to: "/community", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Calendar, title: "Government Schemes", description: "Discover and apply for agricultural schemes and subsidies from state and central government.", to: "/schemes", color: "text-red-500", bg: "bg-red-50" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="section-title">Everything You Need to Farm Better</h2>
          <p className="section-subtitle">Access powerful tools and insights designed specifically for Indian farmers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={service.to} className="service-card block hover:shadow-card-hover transition-all">
                <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-5`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
