import { useState } from "react";
import { Search, Thermometer, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";

const crops = [
  { key: "rice", name: "Rice", season: "Kharif", emoji: "🌾", temp: "20-35°C", water: "100-200" },
  { key: "wheat", name: "Wheat", season: "Rabi", emoji: "🌾", temp: "12-25°C", water: "50-100" },
  { key: "cotton", name: "Cotton", season: "Kharif", emoji: "🌿", temp: "21-30°C", water: "60-100" },
  { key: "sugarcane", name: "Sugarcane", season: "Throughout", emoji: "🎋", temp: "21-27°C", water: "100-150" },
  { key: "maize", name: "Maize", season: "Kharif", emoji: "🌽", temp: "21-27°C", water: "50-100" },
  { key: "groundnut", name: "Groundnut", season: "Kharif", emoji: "🥜", temp: "20-30°C", water: "50-75" },
  { key: "soybean", name: "Soybean", season: "Kharif", emoji: "🫘", temp: "20-30°C", water: "60-100" },
  { key: "mustard", name: "Mustard", season: "Rabi", emoji: "🌼", temp: "10-25°C", water: "25-40" },
  { key: "potato", name: "Potato", season: "Rabi", emoji: "🥔", temp: "15-25°C", water: "50-75" },
  { key: "tomato", name: "Tomato", season: "Throughout", emoji: "🍅", temp: "20-27°C", water: "40-60" },
  { key: "onion", name: "Onion", season: "Rabi", emoji: "🧅", temp: "13-24°C", water: "50-75" },
  { key: "chilli", name: "Chilli", season: "Kharif", emoji: "🌶️", temp: "20-30°C", water: "60-125" },
  { key: "turmeric", name: "Turmeric", season: "May-June", emoji: "🟡", temp: "20-30°C", water: "100-200" },
  { key: "banana", name: "Banana", season: "Throughout", emoji: "🍌", temp: "20-35°C", water: "100-200" },
  { key: "mango", name: "Mango", season: "Summer", emoji: "🥭", temp: "24-30°C", water: "75-250" },
  { key: "tea", name: "Tea", season: "Throughout", emoji: "🍵", temp: "20-30°C", water: "150-300" },
  { key: "coffee", name: "Coffee", season: "Throughout", emoji: "☕", temp: "15-28°C", water: "150-250" },
  { key: "coconut", name: "Coconut", season: "Throughout", emoji: "🥥", temp: "27-32°C", water: "100-300" },
  { key: "jute", name: "Jute", season: "Kharif", emoji: "🌿", temp: "24-35°C", water: "150-200" },
  { key: "chana", name: "Pulses (Chana)", season: "Rabi", emoji: "🫘", temp: "20-25°C", water: "40-50" },
];

const seasonKeys = ["allSeasons", "kharif", "rabi", "summer", "throughout"];
const seasonMap: Record<string, string> = { allSeasons: "All Seasons", kharif: "Kharif", rabi: "Rabi", summer: "Summer", throughout: "Throughout" };

const Crops = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("allSeasons");

  const filtered = crops.filter((c) => {
    const translatedName = t(`crops.items.${c.key}.name`, c.name);
    const matchSearch = translatedName.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
    const matchSeason = season === "allSeasons" || c.season.toLowerCase().includes(seasonMap[season].toLowerCase());
    return matchSearch && matchSeason;
  });

  return (
    <div className="min-h-screen bg-muted">
      
      <div className="py-8 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("crops.title")}</h1>
          <p className="text-primary mb-8">{t("crops.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("crops.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {seasonKeys.map((s) => (
                <button key={s} onClick={() => setSeason(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${season === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
                  {t(`crops.seasons.${s}`, seasonMap[s])}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((crop) => (
              <div key={crop.key} className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{crop.emoji}</span>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{t(`crops.items.${crop.key}.name`, crop.name)}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${crop.season === "Kharif" ? "bg-primary/10 text-primary" : crop.season === "Rabi" ? "bg-blue-50 text-blue-600" : crop.season === "Summer" ? "bg-orange-50 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                      {t(`crops.seasons.${crop.season.toLowerCase()}`, crop.season)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{t(`crops.items.${crop.key}.desc`, "")}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-destructive" /> {crop.temp}</span>
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> {crop.water}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Crops;
