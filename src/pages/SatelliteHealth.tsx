import { useState } from "react";
import { Satellite, Leaf, MapPin, Search, Info, BarChart3, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ndviLegend = [
  { range: "0.0 – 0.1", label: "barren", color: "bg-red-600" },
  { range: "0.1 – 0.2", label: "sparse", color: "bg-orange-500" },
  { range: "0.2 – 0.4", label: "moderate", color: "bg-yellow-400" },
  { range: "0.4 – 0.6", label: "healthy", color: "bg-lime-500" },
  { range: "0.6 – 1.0", label: "veryHealthy", color: "bg-green-600" },
];

interface RegionData {
  name: string;
  ndvi: number;
  status: string;
  statusKey: string;
  area: string;
  crop: string;
  lastUpdated: string;
}

const sampleRegions: RegionData[] = [
  { name: "Rajkot, Gujarat", ndvi: 0.72, status: "Very Healthy", statusKey: "veryHealthy", area: "12,500 ha", crop: "Groundnut", lastUpdated: "2 hours ago" },
  { name: "Indore, MP", ndvi: 0.55, status: "Healthy", statusKey: "healthy", area: "8,200 ha", crop: "Soybean", lastUpdated: "3 hours ago" },
  { name: "Nashik, Maharashtra", ndvi: 0.41, status: "Moderate", statusKey: "moderate", area: "6,800 ha", crop: "Onion", lastUpdated: "1 hour ago" },
  { name: "Guntur, AP", ndvi: 0.28, status: "Sparse", statusKey: "sparse", area: "9,100 ha", crop: "Chilli", lastUpdated: "4 hours ago" },
  { name: "Ludhiana, Punjab", ndvi: 0.68, status: "Very Healthy", statusKey: "veryHealthy", area: "15,300 ha", crop: "Wheat", lastUpdated: "2 hours ago" },
  { name: "Kolar, Karnataka", ndvi: 0.35, status: "Moderate", statusKey: "moderate", area: "4,600 ha", crop: "Tomato", lastUpdated: "5 hours ago" },
  { name: "Thanjavur, TN", ndvi: 0.63, status: "Healthy", statusKey: "healthy", area: "11,200 ha", crop: "Rice", lastUpdated: "1 hour ago" },
  { name: "Alwar, Rajasthan", ndvi: 0.15, status: "Sparse", statusKey: "sparse", area: "7,400 ha", crop: "Mustard", lastUpdated: "6 hours ago" },
];

const getNdviColor = (ndvi: number) => {
  if (ndvi >= 0.6) return "text-green-600";
  if (ndvi >= 0.4) return "text-lime-500";
  if (ndvi >= 0.2) return "text-yellow-500";
  if (ndvi >= 0.1) return "text-orange-500";
  return "text-red-600";
};

const getNdviBg = (ndvi: number) => {
  if (ndvi >= 0.6) return "bg-green-100 border-green-300";
  if (ndvi >= 0.4) return "bg-lime-100 border-lime-300";
  if (ndvi >= 0.2) return "bg-yellow-100 border-yellow-300";
  if (ndvi >= 0.1) return "bg-orange-100 border-orange-300";
  return "bg-red-100 border-red-300";
};

const SatelliteHealth = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = sampleRegions.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.crop.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const avgNdvi = (sampleRegions.reduce((s, r) => s + r.ndvi, 0) / sampleRegions.length).toFixed(2);
  const healthyCount = sampleRegions.filter(r => r.ndvi >= 0.4).length;
  const stressedCount = sampleRegions.filter(r => r.ndvi < 0.4).length;

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-2">
            <Satellite className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground font-display">{t("satellite.title")}</h1>
          </div>
          <p className="text-muted-foreground mb-8">{t("satellite.subtitle")}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("satellite.regionsMonitored"), value: sampleRegions.length.toString(), icon: MapPin },
              { label: t("satellite.avgNdvi"), value: avgNdvi, icon: BarChart3 },
              { label: t("satellite.healthyZones"), value: healthyCount.toString(), icon: Leaf },
              { label: t("satellite.stressedZones"), value: stressedCount.toString(), icon: Info },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <s.icon className="w-6 h-6 text-primary" />
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-3 mb-6">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 flex-1 max-w-md">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder={t("satellite.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
            </div>
            <button onClick={handleSearch} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          {/* NDVI Legend */}
          <div className="bg-card border border-border rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-foreground text-sm mb-3">{t("satellite.ndviLegend")}</h3>
            <div className="flex flex-wrap gap-3">
              {ndviLegend.map(l => (
                <div key={l.range} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${l.color}`} />
                  <span className="text-xs text-muted-foreground">{l.range} — {t(`satellite.${l.label}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(region => (
              <div key={region.name} className={`bg-card border rounded-2xl p-6 cursor-pointer hover:shadow-card-hover transition-all ${selectedRegion?.name === region.name ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
                onClick={() => setSelectedRegion(region)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{region.name}</h3>
                    <p className="text-xs text-muted-foreground">{region.crop} • {region.area}</p>
                  </div>
                  <div className={`text-2xl font-bold ${getNdviColor(region.ndvi)}`}>{region.ndvi.toFixed(2)}</div>
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getNdviBg(region.ndvi)}`}>
                  {t(`satellite.${region.statusKey}`)}
                </div>
                <div className="mt-3 w-full bg-muted rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${region.ndvi >= 0.6 ? "bg-green-500" : region.ndvi >= 0.4 ? "bg-lime-500" : region.ndvi >= 0.2 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${region.ndvi * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t("satellite.lastUpdated")}: {region.lastUpdated}</p>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {selectedRegion && (
            <div className="mt-8 bg-card border border-border rounded-2xl p-8">
              <h2 className="text-xl font-bold text-foreground font-display mb-4">{t("satellite.detailTitle")} — {selectedRegion.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.ndviScore")}</p>
                  <p className={`text-3xl font-bold ${getNdviColor(selectedRegion.ndvi)}`}>{selectedRegion.ndvi.toFixed(2)}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.status")}</p>
                  <p className="text-lg font-bold text-foreground">{t(`satellite.${selectedRegion.statusKey}`)}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.cropGrown")}</p>
                  <p className="text-lg font-bold text-foreground">{selectedRegion.crop}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.areaMonitored")}</p>
                  <p className="text-lg font-bold text-foreground">{selectedRegion.area}</p>
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-2">{t("satellite.recommendation")}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedRegion.ndvi >= 0.6 ? t("satellite.recVeryHealthy") :
                    selectedRegion.ndvi >= 0.4 ? t("satellite.recHealthy") :
                      selectedRegion.ndvi >= 0.2 ? t("satellite.recModerate") :
                        t("satellite.recSparse")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SatelliteHealth;
