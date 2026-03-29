import { motion } from "framer-motion";
import cropsImg from "@/assets/crops-organic.jpg";
import smartImg from "@/assets/smart-farming.jpg";
import riceImg from "@/assets/rice-field.jpg";

const crops = [
  {
    name: "Rice (Dhaan)",
    season: "Kharif",
    image: riceImg,
    soil: "Clay, Loamy",
    climate: "Hot & Humid",
    duration: "120-150 days",
    water: "High",
    description: "India's most important staple crop. Requires standing water in paddy fields with proper irrigation systems.",
    tips: ["Transplant seedlings at 20-25 days", "Use SRI method for better yield", "Apply zinc sulfate at sowing"],
  },
  {
    name: "Wheat (Gehu)",
    season: "Rabi",
    image: smartImg,
    soil: "Loamy, Clay Loam",
    climate: "Cool & Dry",
    duration: "110-130 days",
    water: "Medium",
    description: "Second most important cereal crop. Best grown in northern plains with well-drained fertile soil.",
    tips: ["Sow in November for best results", "4-6 irrigations needed", "Harvest when golden yellow"],
  },
  {
    name: "Vegetables",
    season: "Year-Round",
    image: cropsImg,
    soil: "Varies by crop",
    climate: "Moderate",
    duration: "45-90 days",
    water: "Medium-High",
    description: "High-value organic vegetables including tomatoes, potatoes, onions, and leafy greens for local and export markets.",
    tips: ["Practice crop rotation", "Use organic compost", "IPM for pest control"],
  },
];

const CropsSection = () => {
  return (
    <section id="crops" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Crop Database</h2>
          <p className="section-subtitle">
            Detailed growing guides with soil, climate, and best practice information for major Indian crops
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {crops.map((crop, i) => (
            <motion.div
              key={crop.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={crop.image}
                  alt={crop.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {crop.season}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{crop.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{crop.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: "Soil", value: crop.soil },
                    { label: "Climate", value: crop.climate },
                    { label: "Duration", value: crop.duration },
                    { label: "Water", value: crop.water },
                  ].map((detail) => (
                    <div key={detail.label} className="bg-muted rounded-lg p-2 text-center">
                      <div className="text-xs text-muted-foreground">{detail.label}</div>
                      <div className="text-xs font-semibold text-foreground">{detail.value}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <div className="text-xs font-semibold text-foreground mb-2">Growing Tips:</div>
                  <ul className="space-y-1">
                    {crop.tips.map((tip) => (
                      <li key={tip} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                        {tip}
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
};

export default CropsSection;
