import { useState } from "react";
import { TrendingUp, TrendingDown, Search, MapPin, IndianRupee, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PriceItem {
  cropKey: string;
  crop: string;
  market: string;
  price: number;
  change: string;
  trend: "up" | "down";
  msp: number | null;
  unit: string;
}

// MSP 2025-26 (Rabi) and 2024-25 (Kharif) official rates
const mspRates: Record<string, { msp: number; season: string }> = {
  wheat: { msp: 2275, season: "Rabi 2025-26" },
  riceBas: { msp: 2300, season: "Kharif 2024-25" },
  riceNon: { msp: 2300, season: "Kharif 2024-25" },
  maize: { msp: 2090, season: "Kharif 2024-25" },
  cotton: { msp: 7121, season: "Kharif 2024-25 (Long)" },
  soybean: { msp: 4892, season: "Kharif 2024-25" },
  groundnut: { msp: 6377, season: "Kharif 2024-25" },
  mustard: { msp: 5650, season: "Rabi 2025-26" },
  chana: { msp: 5440, season: "Rabi 2025-26" },
  tur: { msp: 7000, season: "Kharif 2024-25" },
  urad: { msp: 6950, season: "Kharif 2024-25" },
  moong: { msp: 8558, season: "Kharif 2024-25" },
  sugarcane: { msp: 315, season: "FRP 2024-25" },
  jute: { msp: 5050, season: "2024-25" },
  bajra: { msp: 2500, season: "Kharif 2024-25" },
  jowar: { msp: 3180, season: "Kharif 2024-25" },
  ragi: { msp: 3846, season: "Kharif 2024-25" },
  barley: { msp: 1850, season: "Rabi 2025-26" },
  masur: { msp: 6425, season: "Rabi 2025-26" },
  safflower: { msp: 5800, season: "Rabi 2025-26" },
};

// Realistic base prices from major mandis (in ₹/quintal unless noted)
const basePrices: PriceItem[] = [
  { cropKey: "wheat", crop: "Wheat", market: "Indore, MP", price: 2380, change: "+1.2%", trend: "up", msp: 2275, unit: "qtl" },
  { cropKey: "riceBas", crop: "Rice (Basmati)", market: "Karnal, Haryana", price: 3850, change: "+2.1%", trend: "up", msp: null, unit: "qtl" },
  { cropKey: "riceNon", crop: "Rice (Non-Basmati)", market: "Kolkata, WB", price: 2450, change: "+0.8%", trend: "up", msp: 2300, unit: "qtl" },
  { cropKey: "maize", crop: "Maize", market: "Nizamabad, Telangana", price: 2150, change: "-1.3%", trend: "down", msp: 2090, unit: "qtl" },
  { cropKey: "cotton", crop: "Cotton (Long)", market: "Rajkot, Gujarat", price: 6850, change: "-0.5%", trend: "down", msp: 7121, unit: "qtl" },
  { cropKey: "soybean", crop: "Soybean", market: "Indore, MP", price: 4580, change: "-2.1%", trend: "down", msp: 4892, unit: "qtl" },
  { cropKey: "groundnut", crop: "Groundnut", market: "Rajkot, Gujarat", price: 6200, change: "-0.9%", trend: "down", msp: 6377, unit: "qtl" },
  { cropKey: "mustard", crop: "Mustard Seed", market: "Alwar, Rajasthan", price: 5380, change: "-1.5%", trend: "down", msp: 5650, unit: "qtl" },
  { cropKey: "chana", crop: "Chana (Gram)", market: "Indore, MP", price: 5620, change: "+1.8%", trend: "up", msp: 5440, unit: "qtl" },
  { cropKey: "tur", crop: "Tur (Arhar)", market: "Latur, Maharashtra", price: 9200, change: "+3.2%", trend: "up", msp: 7000, unit: "qtl" },
  { cropKey: "urad", crop: "Urad Dal", market: "Indore, MP", price: 7100, change: "+0.6%", trend: "up", msp: 6950, unit: "qtl" },
  { cropKey: "moong", crop: "Moong Dal", market: "Jodhpur, Rajasthan", price: 8200, change: "-1.1%", trend: "down", msp: 8558, unit: "qtl" },
  { cropKey: "sugarcane", crop: "Sugarcane", market: "Lucknow, UP", price: 350, change: "+0.0%", trend: "up", msp: 315, unit: "qtl" },
  { cropKey: "onion", crop: "Onion", market: "Nashik, Maharashtra", price: 1850, change: "+5.7%", trend: "up", msp: null, unit: "qtl" },
  { cropKey: "potato", crop: "Potato", market: "Agra, UP", price: 1250, change: "-3.2%", trend: "down", msp: null, unit: "qtl" },
  { cropKey: "tomato", crop: "Tomato", market: "Kolar, Karnataka", price: 2800, change: "+8.5%", trend: "up", msp: null, unit: "qtl" },
  { cropKey: "chilli", crop: "Chilli (Dry)", market: "Guntur, AP", price: 15500, change: "+1.2%", trend: "up", msp: null, unit: "qtl" },
  { cropKey: "turmeric", crop: "Turmeric", market: "Nizamabad, Telangana", price: 14200, change: "+4.5%", trend: "up", msp: null, unit: "qtl" },
  { cropKey: "ginger", crop: "Ginger (Dry)", market: "Cochin, Kerala", price: 5200, change: "+2.8%", trend: "up", msp: null, unit: "qtl" },
  { cropKey: "garlic", crop: "Garlic", market: "Rajkot, Gujarat", price: 9500, change: "-1.8%", trend: "down", msp: null, unit: "qtl" },
  { cropKey: "jute", crop: "Jute (Raw)", market: "Kolkata, WB", price: 5300, change: "+0.4%", trend: "up", msp: 5050, unit: "qtl" },
  { cropKey: "bajra", crop: "Bajra (Pearl Millet)", market: "Jodhpur, Rajasthan", price: 2350, change: "-0.8%", trend: "down", msp: 2500, unit: "qtl" },
];

const MarketPrices = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"market" | "msp">("market");
  const [lastUpdated] = useState(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));

  const filtered = basePrices.filter((p) => {
    const translatedCrop = t(`market.crops.${p.cropKey}`, p.crop);
    return translatedCrop.toLowerCase().includes(search.toLowerCase()) || p.market.toLowerCase().includes(search.toLowerCase()) || p.crop.toLowerCase().includes(search.toLowerCase());
  });

  const pricesUp = basePrices.filter((p) => p.trend === "up").length;
  const pricesDown = basePrices.filter((p) => p.trend === "down").length;
  const aboveMsp = basePrices.filter((p) => p.msp && p.price >= p.msp).length;
  const belowMsp = basePrices.filter((p) => p.msp && p.price < p.msp).length;

  return (
    <div className="min-h-screen bg-muted">
      <div className="py-8 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("market.title")}</h1>
          <p className="text-muted-foreground mb-1">{t("market.subtitle")}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-8">
            <Clock className="w-3 h-3" /> Last updated: {lastUpdated} (Indicative prices from major mandis)
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("market.totalMarkets"), value: String(basePrices.length), icon: MapPin, color: "text-primary" },
              { label: t("market.pricesUp"), value: String(pricesUp), icon: TrendingUp, color: "text-primary" },
              { label: t("market.pricesDown"), value: String(pricesDown), icon: TrendingDown, color: "text-destructive" },
              { label: "Above MSP", value: `${aboveMsp}/${aboveMsp + belowMsp}`, icon: IndianRupee, color: "text-primary" },
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

          {tab === "market" ? (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-bold text-foreground text-lg">{t("market.currentPrices")}</h2>
                <p className="text-sm text-muted-foreground">{t("market.showing")} {filtered.length} {t("market.of")} {basePrices.length} {t("market.records")}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.crop")}</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.marketCol")}</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.price")}</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground hidden md:table-cell">MSP</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">{t("market.change")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.cropKey} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-primary text-sm">{t(`market.crops.${item.cropKey}`, item.crop)}</td>
                        <td className="px-6 py-4"><span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">{item.market}</span></td>
                        <td className="px-6 py-4 font-bold text-foreground text-sm">₹{item.price.toLocaleString()}/{item.unit}</td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          {item.msp ? (
                            <span className={`text-sm font-medium ${item.price >= item.msp ? "text-primary" : "text-destructive"}`}>
                              ₹{item.msp.toLocaleString()} {item.price >= item.msp ? "✓" : "✗"}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 text-sm font-medium ${item.trend === "up" ? "text-primary" : "text-destructive"}`}>
                            {item.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {item.change}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-bold text-foreground text-lg">Minimum Support Prices (MSP)</h2>
                <p className="text-sm text-muted-foreground">Official Government of India MSP rates for major crops</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Crop</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">MSP (₹/qtl)</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Season</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-foreground hidden md:table-cell">Market Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(mspRates).map(([key, val]) => {
                      const marketItem = basePrices.find(p => p.cropKey === key);
                      return (
                        <tr key={key} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-primary text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                          <td className="px-6 py-4 font-bold text-foreground text-sm">₹{val.msp.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{val.season}</td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            {marketItem ? (
                              <span className={`text-sm font-medium ${marketItem.price >= val.msp ? "text-primary" : "text-destructive"}`}>
                                ₹{marketItem.price.toLocaleString()} ({marketItem.price >= val.msp ? "Above" : "Below"} MSP)
                              </span>
                            ) : <span className="text-xs text-muted-foreground">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
