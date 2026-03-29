import { motion } from "framer-motion";
import cropsImg from "@/assets/crops-organic.jpg";
import smartImg from "@/assets/smart-farming.jpg";
import riceImg from "@/assets/rice-field.jpg";

const crops = [
  {
    name: "Rice & Wheat",
    season: "Kharif / Rabi",
    image: riceImg,
    description: "Staple food grains forming the backbone of agriculture. Best grown with proper irrigation and fertile alluvial soil.",
    details: ["Sowing: June-July / Oct-Nov", "Harvest: Nov-Dec / Mar-Apr", "Yield: 3-5 tons/hectare"],
  },
  {
    name: "Organic Vegetables",
    season: "Year-Round",
    image: cropsImg,
    description: "High-value organic produce including tomatoes, carrots, peppers, and leafy greens for local and export markets.",
    details: ["Chemical-free farming", "Premium market prices", "Growing demand globally"],
  },
  {
    name: "Smart Farming",
    season: "Technology-Driven",
    image: smartImg,
    description: "Precision agriculture using drones, IoT sensors, and AI to optimize crop yields and reduce resource wastage.",
    details: ["Drone crop monitoring", "Soil sensor analytics", "AI-based predictions"],
  },
];

const CropsSection = () => {
  return (
    <section id="crops" className="py-20 bg-accent/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">Crop Information</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Know Your Crops
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Detailed information about crop varieties, growing seasons, and modern farming techniques.
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
              <div className="h-52 overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-xl font-bold text-foreground">{crop.name}</h3>
                  <span className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full font-medium">
                    {crop.season}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{crop.description}</p>
                <ul className="space-y-1.5">
                  {crop.details.map((detail) => (
                    <li key={detail} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CropsSection;
