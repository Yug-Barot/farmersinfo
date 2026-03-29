import { motion } from "framer-motion";
import { Sprout, CloudSun, TrendingUp, Bug, Droplets, Truck, BookOpen, Users } from "lucide-react";

const services = [
  {
    icon: Sprout,
    title: "Crop Management",
    description: "Complete guide on crop selection, planting schedules, soil preparation, and harvest techniques for maximum yield.",
  },
  {
    icon: CloudSun,
    title: "Weather Forecasting",
    description: "Real-time weather updates and seasonal forecasts to help you plan farming activities effectively.",
  },
  {
    icon: TrendingUp,
    title: "Market Prices",
    description: "Live market prices for crops, vegetables, and grains across major mandis and trading platforms.",
  },
  {
    icon: Bug,
    title: "Pest & Disease Control",
    description: "Identify crop diseases and pests with expert recommendations for organic and chemical treatments.",
  },
  {
    icon: Droplets,
    title: "Irrigation Solutions",
    description: "Modern irrigation techniques including drip, sprinkler, and smart water management systems.",
  },
  {
    icon: Truck,
    title: "Supply Chain",
    description: "Connect directly with buyers, wholesalers, and retailers to get the best prices for your produce.",
  },
  {
    icon: BookOpen,
    title: "Government Schemes",
    description: "Information about agricultural subsidies, loans, insurance, and government welfare schemes for farmers.",
  },
  {
    icon: Users,
    title: "Community Forum",
    description: "Join a community of farmers to share knowledge, experiences, and best practices with peers.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Comprehensive Farming Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From crop planning to market access, we provide everything a modern farmer needs to succeed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
