import { motion } from "framer-motion";
import { BookOpen, Video, FileText, Lightbulb } from "lucide-react";

const resources = [
  {
    icon: BookOpen,
    title: "Crop Growing Guides",
    description: "Step-by-step guides for growing 20+ crops with seasonal calendars, soil preparation, and harvest techniques.",
    items: ["Rice Cultivation Guide", "Wheat Growing Manual", "Vegetable Farming Tips", "Organic Practices"],
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch expert farmers and agricultural scientists demonstrate modern farming techniques.",
    items: ["Drip Irrigation Setup", "Pest Identification", "Soil Testing Methods", "Composting Basics"],
  },
  {
    icon: FileText,
    title: "Research & Reports",
    description: "Access the latest agricultural research, market analysis reports, and policy updates.",
    items: ["Crop Price Trends 2026", "Climate Impact Report", "Organic Market Analysis", "Subsidy Updates"],
  },
  {
    icon: Lightbulb,
    title: "Farming Innovations",
    description: "Learn about the latest agricultural technologies transforming farming across India.",
    items: ["Drone Spraying", "IoT Soil Sensors", "AI Crop Diagnosis", "Vertical Farming"],
  },
];

const LearningSection = () => (
  <section id="learning" className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Learning Hub</h2>
        <p className="section-subtitle">
          Free educational resources to help you become a smarter, more profitable farmer
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res, i) => (
          <motion.div
            key={res.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border hover:shadow-card-hover transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <res.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{res.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{res.description}</p>
                <ul className="grid grid-cols-2 gap-2">
                  {res.items.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-secondary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default LearningSection;
