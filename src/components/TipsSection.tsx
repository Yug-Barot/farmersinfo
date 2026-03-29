import { motion } from "framer-motion";
import { Lightbulb, Calendar, FlaskConical, Thermometer, Leaf, Zap } from "lucide-react";

const tips = [
  {
    icon: FlaskConical,
    title: "Soil Testing",
    tip: "Test your soil every season before planting. Understanding pH levels and nutrient content helps choose the right fertilizers and crops.",
  },
  {
    icon: Calendar,
    title: "Crop Rotation",
    tip: "Rotate crops each season to maintain soil health, prevent pest buildup, and improve overall yield naturally.",
  },
  {
    icon: Thermometer,
    title: "Climate Adaptation",
    tip: "Choose crop varieties suited to your local climate. Heat-resistant and drought-tolerant varieties can save your harvest.",
  },
  {
    icon: Leaf,
    title: "Organic Composting",
    tip: "Use farm waste to create organic compost. It enriches soil, reduces costs, and promotes sustainable farming practices.",
  },
  {
    icon: Zap,
    title: "Drip Irrigation",
    tip: "Switch to drip irrigation to save up to 60% water while delivering nutrients directly to plant roots for better growth.",
  },
  {
    icon: Lightbulb,
    title: "Record Keeping",
    tip: "Maintain detailed records of expenses, yields, weather, and practices. Data-driven farming leads to smarter decisions.",
  },
];

const TipsSection = () => {
  return (
    <section id="tips" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">Expert Advice</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Farming Tips & Best Practices
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practical advice from agricultural experts to help you grow more with less effort.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.tip}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TipsSection;
