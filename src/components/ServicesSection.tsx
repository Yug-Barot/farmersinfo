import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CloudSun, TrendingUp, Sprout, MessageSquare, Users, Calendar, Satellite, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    { icon: CloudSun, title: t("services.weather.title"), description: t("services.weather.desc"), to: "/weather", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: TrendingUp, title: t("services.market.title"), description: t("services.market.desc"), to: "/market-prices", color: "text-primary", bg: "bg-accent" },
    { icon: Sprout, title: t("services.crops.title"), description: t("services.crops.desc"), to: "/crops", color: "text-primary", bg: "bg-accent" },
    { icon: MessageSquare, title: t("services.ai.title"), description: t("services.ai.desc"), to: "/ai-assistant", color: "text-violet-500", bg: "bg-violet-50" },
    { icon: Users, title: t("services.community.title"), description: t("services.community.desc"), to: "/community", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: Calendar, title: t("services.schemes.title"), description: t("services.schemes.desc"), to: "/schemes", color: "text-red-500", bg: "bg-red-50" },
    { icon: Satellite, title: t("services.satellite.title"), description: t("services.satellite.desc"), to: "/satellite-health", color: "text-teal-500", bg: "bg-teal-50" },
    { icon: BarChart3, title: t("services.yield.title"), description: t("services.yield.desc"), to: "/yield-prediction", color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="section-title">{t("services.title")}</h2>
          <p className="section-subtitle">{t("services.subtitle")}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div key={service.to} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
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
