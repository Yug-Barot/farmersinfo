import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const prices = [
  { crop: "Wheat", price: "₹2,450", unit: "/qtl", change: "+2.3%", trend: "up", mandi: "Azadpur, Delhi" },
  { crop: "Rice (Basmati)", price: "₹3,800", unit: "/qtl", change: "+1.5%", trend: "up", mandi: "Karnal, Haryana" },
  { crop: "Tomato", price: "₹45", unit: "/kg", change: "-5.2%", trend: "down", mandi: "Kolar, Karnataka" },
  { crop: "Onion", price: "₹28", unit: "/kg", change: "+8.1%", trend: "up", mandi: "Nashik, Maharashtra" },
  { crop: "Potato", price: "₹18", unit: "/kg", change: "0.0%", trend: "neutral", mandi: "Agra, UP" },
  { crop: "Cotton", price: "₹6,200", unit: "/qtl", change: "+3.7%", trend: "up", mandi: "Rajkot, Gujarat" },
  { crop: "Soybean", price: "₹4,500", unit: "/qtl", change: "-1.2%", trend: "down", mandi: "Indore, MP" },
  { crop: "Mustard", price: "₹5,100", unit: "/qtl", change: "+0.8%", trend: "up", mandi: "Alwar, Rajasthan" },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-primary" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const MarketPricesSection = () => (
  <section id="market" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="section-title">Live Market Prices</h2>
        <p className="section-subtitle">
          Real-time mandi prices updated daily from major trading centers across India
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Crop</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Change</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground hidden md:table-cell">Mandi</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, i) => (
                <tr key={item.crop} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">{item.crop}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground">{item.price}</span>
                    <span className="text-muted-foreground text-sm">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                      item.trend === "up" ? "text-primary" : item.trend === "down" ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      <TrendIcon trend={item.trend} />
                      {item.change}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm hidden md:table-cell">{item.mandi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  </section>
);

export default MarketPricesSection;
