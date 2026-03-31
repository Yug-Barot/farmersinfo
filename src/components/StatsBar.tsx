import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const StatsBar = () => {
  const { t } = useTranslation();
  const stats = [
    { value: "50K+", label: t("stats.activeFarmers") },
    { value: "20+", label: t("stats.cropVarieties") },
    { value: "100+", label: t("stats.mandisTracked") },
    { value: "24/7", label: t("stats.aiSupport") },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="stat-value">{stat.value}</div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
