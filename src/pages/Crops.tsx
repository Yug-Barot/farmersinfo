import { useState } from "react";
import { Search, Thermometer, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const crops = [
  { name: "Rice", season: "Kharif", emoji: "🌾", temp: "20-35°C", water: "100-200", desc: "Rice is the staple food for more than half of the world's population." },
  { name: "Wheat", season: "Rabi", emoji: "🌾", temp: "12-25°C", water: "50-100", desc: "Wheat is one of the most important cereals." },
  { name: "Cotton", season: "Kharif", emoji: "🌿", temp: "21-30°C", water: "60-100", desc: "Cotton is a major fiber crop requiring warm climate." },
  { name: "Sugarcane", season: "Throughout", emoji: "🎋", temp: "21-27°C", water: "100-150", desc: "Sugarcane is a tropical grass requiring high temperature." },
  { name: "Maize", season: "Kharif", emoji: "🌽", temp: "21-27°C", water: "50-100", desc: "Maize is a versatile crop used for food, fodder, and industrial purposes." },
  { name: "Groundnut", season: "Kharif", emoji: "🥜", temp: "20-30°C", water: "50-75", desc: "Groundnut is an important oilseed crop." },
  { name: "Soybean", season: "Kharif", emoji: "🫘", temp: "20-30°C", water: "60-100", desc: "Soybean is a protein-rich crop used for oil extraction." },
  { name: "Mustard", season: "Rabi", emoji: "🌼", temp: "10-25°C", water: "25-40", desc: "Mustard is an important Rabi oilseed crop." },
  { name: "Potato", season: "Rabi", emoji: "🥔", temp: "15-25°C", water: "50-75", desc: "Potato is a major vegetable crop requiring cool climate." },
  { name: "Tomato", season: "Throughout", emoji: "🍅", temp: "20-27°C", water: "40-60", desc: "Tomato is a popular vegetable crop grown throughout India." },
  { name: "Onion", season: "Rabi", emoji: "🧅", temp: "13-24°C", water: "50-75", desc: "Onion is a major spice crop requiring cool climate." },
  { name: "Chilli", season: "Kharif", emoji: "🌶️", temp: "20-30°C", water: "60-125", desc: "Chilli is an important spice crop." },
  { name: "Turmeric", season: "May-June", emoji: "🟡", temp: "20-30°C", water: "100-200", desc: "Turmeric is a rhizomatous spice crop." },
  { name: "Banana", season: "Throughout", emoji: "🍌", temp: "20-35°C", water: "100-200", desc: "Banana is a tropical fruit requiring warm climate." },
  { name: "Mango", season: "Summer", emoji: "🥭", temp: "24-30°C", water: "75-250", desc: "Mango is the national fruit of India." },
  { name: "Tea", season: "Throughout", emoji: "🍵", temp: "20-30°C", water: "150-300", desc: "Tea is grown in hilly areas with heavy rainfall." },
  { name: "Coffee", season: "Throughout", emoji: "☕", temp: "15-28°C", water: "150-250", desc: "Coffee is grown in the hilly regions of Karnataka, Kerala." },
  { name: "Coconut", season: "Throughout", emoji: "🥥", temp: "27-32°C", water: "100-300", desc: "Coconut is a versatile palm crop grown along coastal areas." },
  { name: "Jute", season: "Kharif", emoji: "🌿", temp: "24-35°C", water: "150-200", desc: "Jute is the golden fiber of India." },
  { name: "Pulses (Chana)", season: "Rabi", emoji: "🫘", temp: "20-25°C", water: "40-50", desc: "Chickpea (Chana) is the most important pulse crop in India." },
];

const seasons = ["All Seasons", "Kharif", "Rabi", "Summer", "Throughout"];

const Crops = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("All Seasons");

  const filtered = crops.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchSeason = season === "All Seasons" || c.season.toLowerCase().includes(season.toLowerCase());
    return matchSearch && matchSeason;
  });

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("crops.title")}</h1>
          <p className="text-primary mb-8">{t("crops.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("crops.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {seasons.map((s) => (
                <button key={s} onClick={() => setSeason(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${season === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
                  {s === "All Seasons" ? t("crops.allSeasons") : s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((crop) => (
              <div key={crop.name} className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{crop.emoji}</span>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{crop.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${crop.season === "Kharif" ? "bg-primary/10 text-primary" : crop.season === "Rabi" ? "bg-blue-50 text-blue-600" : crop.season === "Summer" ? "bg-orange-50 text-orange-600" : "bg-muted text-muted-foreground"}`}>{crop.season}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{crop.desc}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-destructive" /> {crop.temp}</span>
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> {crop.water}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Crops;
