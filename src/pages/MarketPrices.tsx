import { useState } from "react";
import { TrendingUp, TrendingDown, Search, MapPin, IndianRupee } from "lucide-react";
import { useTranslation } from "react-i18next";

const allPrices = [
  { cropKey: "riceBas", crop: "Rice (Basmati)", market: "Delhi", price: 3412, change: "2.5%", trend: "down" as const },
  { cropKey: "riceNon", crop: "Rice (Non-Basmati)", market: "Kolkata", price: 2157, change: "2.0%", trend: "down" as const },
  { cropKey: "wheat", crop: "Wheat", market: "Indore", price: 2319, change: "+1.9%", trend: "up" as const },
  { cropKey: "maize", crop: "Maize", market: "Nizamabad", price: 1859, change: "0.6%", trend: "down" as const },
  { cropKey: "cotton", crop: "Cotton", market: "Rajkot", price: 6504, change: "+0.1%", trend: "up" as const },
  { cropKey: "soybean", crop: "Soybean", market: "Indore", price: 4236, change: "1.5%", trend: "down" as const },
  { cropKey: "groundnut", crop: "Groundnut", market: "Rajkot", price: 5744, change: "1.0%", trend: "down" as const },
  { cropKey: "mustard", crop: "Mustard", market: "Alwar", price: 5074, change: "2.4%", trend: "down" as const },
  { cropKey: "chana", crop: "Chana (Gram)", market: "Indore", price: 5148, change: "+0.9%", trend: "up" as const },
  { cropKey: "tur", crop: "Tur (Arhar)", market: "Latur", price: 7256, change: "+0.8%", trend: "up" as const },
  { cropKey: "urad", crop: "Urad", market: "Indore", price: 6831, change: "+0.5%", trend: "up" as const },
  { cropKey: "moong", crop: "Moong", market: "Jodhpur", price: 7532, change: "+0.4%", trend: "up" as const },
  { cropKey: "sugarcane", crop: "Sugarcane", market: "UP", price: 308, change: "2.3%", trend: "down" as const },
  { cropKey: "onion", crop: "Onion", market: "Nashik", price: 1817, change: "+1.0%", trend: "up" as const },
  { cropKey: "potato", crop: "Potato", market: "Agra", price: 1195, change: "0.4%", trend: "down" as const },
  { cropKey: "tomato", crop: "Tomato", market: "Kolar", price: 2510, change: "+0.4%", trend: "up" as const },
  { cropKey: "chilli", crop: "Chilli (Dry)", market: "Guntur", price: 14778, change: "1.5%", trend: "down" as const },
  { cropKey: "turmeric", crop: "Turmeric", market: "Nizamabad", price: 9352, change: "1.6%", trend: "down" as const },
  { cropKey: "ginger", crop: "Ginger", market: "Cochin", price: 4896, change: "+2.0%", trend: "up" as const },
  { cropKey: "garlic", crop: "Garlic", market: "Rajkot", price: 8603, change: "+1.2%", trend: "up" as const },
];

const MarketPrices = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"market" | "msp">("market");

  const filtered = allPrices.filter((p) => {
    const translatedCrop = t(`market.crops.${p.cropKey}`, p.crop);
    return translatedCrop.toLowerCase().includes(search.toLowerCase()) || p.market.toLowerCase().includes(search.toLowerCase()) || p.crop.toLowerCase().includes(search.toLowerCase());
  });

  const pricesUp = allPrices.filter((p) => p.trend === "up").length;
  const pricesDown = allPrices.filter((p) => p.trend === "down").length;
  const avgPrice = Math.round(allPrices.reduce((a, p) => a + p.price, 0) / allPrices.length);

  return (
    <div className="min-h-screen bg-muted">
      
      <div className="py-8 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("market.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("market.subtitle")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("market.totalMarkets"), value: "20", icon: MapPin, color: "text-primary" },
              { label: t("market.avgPrice"), value: `₹${avgPrice}`, icon: IndianRupee, color: "text-primary" },
              { label: t("market.pricesUp"), value: String(pricesUp), icon: TrendingUp, color: "text-primary" },
              { label: t("market.pricesDown"), value: String(pricesDown), icon: TrendingDown, color: "text-destructive" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                <div><p className="text-xs text-muted-foreground mb-1">{s.label}</p><p className="text-2xl font-bold text-foreground">{s.value}</p></div>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setTab("market")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "market" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>{t("market.marketPrices")}</button>
            <button onClick={() => setTab("msp")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "msp" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>{t("market.mspRates")}</button>
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 mb-6 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("market.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-bold text-foreground text-lg">{t("market.currentPrices")}</h2>
              <p className="text-sm text-muted-foreground">{t("market.showing")} {filtered.length} {t("market.of")} {allPrices.length} {t("market.records")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.crop")}</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.marketCol")}</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.price")}</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.change")}</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.trend")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.cropKey} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary text-sm">{t(`market.crops.${item.cropKey}`, item.crop)}</td>
                      <td className="px-6 py-4"><span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">{item.market}</span></td>
                      <td className="px-6 py-4 font-bold text-foreground text-sm">₹{item.price.toLocaleString()}/{t("market.quintal") || "quintal"}</td>
                      <td className="px-6 py-4"><span className={`text-sm font-medium ${item.trend === "up" ? "text-primary" : "text-destructive"}`}>{item.change}</span></td>
                      <td className="px-6 py-4">{item.trend === "up" ? <TrendingUp className="w-4 h-4 text-primary" /> : <TrendingDown className="w-4 h-4 text-destructive" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default MarketPrices;
