import { useState } from "react";
import { Satellite, Leaf, MapPin, Search, Info, BarChart3, Loader2, ChevronRight } from "lucide-react";
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

interface StateData {
  id: string;
  name: string;
  ndvi: number;
  statusKey: string;
  area: string;
  majorCrops: { name: string; production: string; area: string }[];
  districts: { name: string; ndvi: number; crop: string; area: string }[];
  // SVG map positioning
  x: number;
  y: number;
}

const indianStates: StateData[] = [
  { id: "punjab", name: "Punjab", ndvi: 0.72, statusKey: "veryHealthy", area: "50,362 sq km",
    majorCrops: [{ name: "Wheat", production: "17.8 MT", area: "3.5M ha" }, { name: "Rice", production: "12.4 MT", area: "3.1M ha" }, { name: "Cotton", production: "0.8 MT", area: "0.3M ha" }],
    districts: [{ name: "Ludhiana", ndvi: 0.75, crop: "Wheat", area: "15,300 ha" }, { name: "Amritsar", ndvi: 0.68, crop: "Rice", area: "12,800 ha" }, { name: "Bathinda", ndvi: 0.62, crop: "Cotton", area: "8,500 ha" }],
    x: 200, y: 80 },
  { id: "haryana", name: "Haryana", ndvi: 0.65, statusKey: "healthy", area: "44,212 sq km",
    majorCrops: [{ name: "Wheat", production: "12.6 MT", area: "2.5M ha" }, { name: "Rice", production: "5.1 MT", area: "1.5M ha" }, { name: "Mustard", production: "1.2 MT", area: "0.6M ha" }],
    districts: [{ name: "Karnal", ndvi: 0.7, crop: "Rice", area: "11,200 ha" }, { name: "Hisar", ndvi: 0.58, crop: "Wheat", area: "9,800 ha" }],
    x: 215, y: 110 },
  { id: "rajasthan", name: "Rajasthan", ndvi: 0.22, statusKey: "sparse", area: "342,239 sq km",
    majorCrops: [{ name: "Mustard", production: "4.8 MT", area: "2.8M ha" }, { name: "Wheat", production: "10.5 MT", area: "3.1M ha" }, { name: "Bajra", production: "3.2 MT", area: "4.5M ha" }],
    districts: [{ name: "Alwar", ndvi: 0.28, crop: "Mustard", area: "7,400 ha" }, { name: "Jaipur", ndvi: 0.20, crop: "Wheat", area: "6,200 ha" }, { name: "Jodhpur", ndvi: 0.12, crop: "Bajra", area: "5,100 ha" }],
    x: 170, y: 160 },
  { id: "gujarat", name: "Gujarat", ndvi: 0.52, statusKey: "healthy", area: "196,024 sq km",
    majorCrops: [{ name: "Groundnut", production: "3.5 MT", area: "1.8M ha" }, { name: "Cotton", production: "8.8 MT", area: "2.7M ha" }, { name: "Wheat", production: "3.2 MT", area: "1.1M ha" }],
    districts: [{ name: "Rajkot", ndvi: 0.58, crop: "Groundnut", area: "12,500 ha" }, { name: "Junagadh", ndvi: 0.55, crop: "Groundnut", area: "10,800 ha" }, { name: "Ahmedabad", ndvi: 0.42, crop: "Cotton", area: "8,200 ha" }],
    x: 130, y: 220 },
  { id: "mp", name: "Madhya Pradesh", ndvi: 0.55, statusKey: "healthy", area: "308,245 sq km",
    majorCrops: [{ name: "Soybean", production: "5.6 MT", area: "5.2M ha" }, { name: "Wheat", production: "19.6 MT", area: "5.8M ha" }, { name: "Gram", production: "4.5 MT", area: "3.2M ha" }],
    districts: [{ name: "Indore", ndvi: 0.58, crop: "Soybean", area: "8,200 ha" }, { name: "Bhopal", ndvi: 0.52, crop: "Wheat", area: "7,600 ha" }],
    x: 240, y: 210 },
  { id: "maharashtra", name: "Maharashtra", ndvi: 0.45, statusKey: "healthy", area: "307,713 sq km",
    majorCrops: [{ name: "Sugarcane", production: "95.5 MT", area: "1.2M ha" }, { name: "Cotton", production: "7.2 MT", area: "4.2M ha" }, { name: "Onion", production: "9.8 MT", area: "0.5M ha" }],
    districts: [{ name: "Nashik", ndvi: 0.48, crop: "Onion", area: "6,800 ha" }, { name: "Pune", ndvi: 0.52, crop: "Sugarcane", area: "9,500 ha" }, { name: "Nagpur", ndvi: 0.38, crop: "Cotton", area: "7,200 ha" }],
    x: 210, y: 280 },
  { id: "karnataka", name: "Karnataka", ndvi: 0.48, statusKey: "healthy", area: "191,791 sq km",
    majorCrops: [{ name: "Rice", production: "4.2 MT", area: "1.5M ha" }, { name: "Ragi", production: "2.1 MT", area: "0.8M ha" }, { name: "Coffee", production: "0.23 MT", area: "0.4M ha" }],
    districts: [{ name: "Kolar", ndvi: 0.35, crop: "Tomato", area: "4,600 ha" }, { name: "Mysuru", ndvi: 0.55, crop: "Rice", area: "8,400 ha" }],
    x: 220, y: 350 },
  { id: "ap", name: "Andhra Pradesh", ndvi: 0.38, statusKey: "moderate", area: "162,968 sq km",
    majorCrops: [{ name: "Rice", production: "12.8 MT", area: "2.3M ha" }, { name: "Chilli", production: "1.8 MT", area: "0.2M ha" }, { name: "Cotton", production: "2.5 MT", area: "0.6M ha" }],
    districts: [{ name: "Guntur", ndvi: 0.32, crop: "Chilli", area: "9,100 ha" }, { name: "Krishna", ndvi: 0.42, crop: "Rice", area: "11,500 ha" }],
    x: 260, y: 320 },
  { id: "tn", name: "Tamil Nadu", ndvi: 0.58, statusKey: "healthy", area: "130,058 sq km",
    majorCrops: [{ name: "Rice", production: "8.2 MT", area: "1.8M ha" }, { name: "Sugarcane", production: "35.2 MT", area: "0.3M ha" }, { name: "Banana", production: "5.8 MT", area: "0.1M ha" }],
    districts: [{ name: "Thanjavur", ndvi: 0.65, crop: "Rice", area: "11,200 ha" }, { name: "Coimbatore", ndvi: 0.52, crop: "Sugarcane", area: "7,800 ha" }],
    x: 240, y: 400 },
  { id: "wb", name: "West Bengal", ndvi: 0.62, statusKey: "healthy", area: "88,752 sq km",
    majorCrops: [{ name: "Rice", production: "15.8 MT", area: "5.6M ha" }, { name: "Jute", production: "8.2 MT", area: "0.6M ha" }, { name: "Potato", production: "12.5 MT", area: "0.4M ha" }],
    districts: [{ name: "Burdwan", ndvi: 0.68, crop: "Rice", area: "14,200 ha" }, { name: "Hooghly", ndvi: 0.55, crop: "Potato", area: "8,600 ha" }],
    x: 340, y: 210 },
  { id: "up", name: "Uttar Pradesh", ndvi: 0.58, statusKey: "healthy", area: "243,286 sq km",
    majorCrops: [{ name: "Wheat", production: "35.5 MT", area: "9.8M ha" }, { name: "Sugarcane", production: "175 MT", area: "2.2M ha" }, { name: "Rice", production: "15.2 MT", area: "5.8M ha" }],
    districts: [{ name: "Lucknow", ndvi: 0.6, crop: "Wheat", area: "10,200 ha" }, { name: "Agra", ndvi: 0.52, crop: "Potato", area: "8,900 ha" }],
    x: 270, y: 140 },
  { id: "telangana", name: "Telangana", ndvi: 0.42, statusKey: "healthy", area: "112,077 sq km",
    majorCrops: [{ name: "Rice", production: "8.5 MT", area: "2.1M ha" }, { name: "Cotton", production: "5.2 MT", area: "1.8M ha" }, { name: "Turmeric", production: "0.3 MT", area: "0.05M ha" }],
    districts: [{ name: "Nizamabad", ndvi: 0.45, crop: "Turmeric", area: "5,200 ha" }, { name: "Warangal", ndvi: 0.40, crop: "Rice", area: "9,800 ha" }],
    x: 250, y: 290 },
  { id: "kerala", name: "Kerala", ndvi: 0.78, statusKey: "veryHealthy", area: "38,863 sq km",
    majorCrops: [{ name: "Coconut", production: "5.9B nuts", area: "0.77M ha" }, { name: "Rubber", production: "0.54 MT", area: "0.55M ha" }, { name: "Rice", production: "0.6 MT", area: "0.2M ha" }],
    districts: [{ name: "Wayanad", ndvi: 0.82, crop: "Coffee", area: "3,200 ha" }, { name: "Thrissur", ndvi: 0.75, crop: "Rice", area: "5,100 ha" }],
    x: 200, y: 410 },
];

const getNdviColor = (ndvi: number) => {
  if (ndvi >= 0.6) return "text-green-600";
  if (ndvi >= 0.4) return "text-lime-500";
  if (ndvi >= 0.2) return "text-yellow-500";
  if (ndvi >= 0.1) return "text-orange-500";
  return "text-red-600";
};

const getNdviBg = (ndvi: number) => {
  if (ndvi >= 0.6) return "bg-green-500";
  if (ndvi >= 0.4) return "bg-lime-500";
  if (ndvi >= 0.2) return "bg-yellow-500";
  if (ndvi >= 0.1) return "bg-orange-500";
  return "bg-red-500";
};

const getNdviBorder = (ndvi: number) => {
  if (ndvi >= 0.6) return "bg-green-100 border-green-300";
  if (ndvi >= 0.4) return "bg-lime-100 border-lime-300";
  if (ndvi >= 0.2) return "bg-yellow-100 border-yellow-300";
  if (ndvi >= 0.1) return "bg-orange-100 border-orange-300";
  return "bg-red-100 border-red-300";
};

const SatelliteHealth = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);

  const filtered = indianStates.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.majorCrops.some(c => c.name.toLowerCase().includes(search.toLowerCase()))
  );

  const avgNdvi = (indianStates.reduce((s, r) => s + r.ndvi, 0) / indianStates.length).toFixed(2);
  const healthyCount = indianStates.filter(r => r.ndvi >= 0.4).length;
  const stressedCount = indianStates.filter(r => r.ndvi < 0.4).length;

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("satellite.regionsMonitored"), value: indianStates.length.toString(), icon: MapPin },
              { label: t("satellite.avgNdvi"), value: avgNdvi, icon: BarChart3 },
              { label: t("satellite.healthyZones"), value: healthyCount.toString(), icon: Leaf },
              { label: t("satellite.stressedZones"), value: stressedCount.toString(), icon: Info },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                <div><p className="text-xs text-muted-foreground mb-1">{s.label}</p><p className="text-2xl font-bold text-foreground">{s.value}</p></div>
                <s.icon className="w-6 h-6 text-primary" />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-6">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 flex-1 max-w-md">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t("satellite.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
            </div>
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

          {/* Interactive India Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">{t("satellite.mapTitle") || "India Crop Health Map"}</h3>
              <div className="relative bg-muted rounded-xl p-4" style={{ minHeight: "450px" }}>
                <svg viewBox="100 40 300 420" className="w-full h-full">
                  {indianStates.map(state => (
                    <g key={state.id} onClick={() => { setSelectedState(state); setSelectedDistrict(null); }} className="cursor-pointer">
                      <circle cx={state.x} cy={state.y} r={selectedState?.id === state.id ? 16 : 12}
                        className={`transition-all ${state.ndvi >= 0.6 ? "fill-green-500" : state.ndvi >= 0.4 ? "fill-lime-500" : state.ndvi >= 0.2 ? "fill-yellow-500" : "fill-red-500"} ${selectedState?.id === state.id ? "stroke-foreground stroke-2" : "stroke-background stroke-1"} hover:opacity-80`} />
                      <text x={state.x} y={state.y + 24} textAnchor="middle" className="fill-foreground text-[7px] font-medium pointer-events-none">{state.name}</text>
                      <text x={state.x} y={state.y + 4} textAnchor="middle" className="fill-white text-[7px] font-bold pointer-events-none">{state.ndvi.toFixed(1)}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* State List */}
            <div className="bg-card border border-border rounded-2xl p-6 overflow-y-auto max-h-[550px]">
              <h3 className="font-bold text-foreground mb-4">{t("satellite.stateList") || "States Overview"}</h3>
              <div className="space-y-2">
                {filtered.map(state => (
                  <button key={state.id} onClick={() => { setSelectedState(state); setSelectedDistrict(null); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${selectedState?.id === state.id ? "bg-primary/10 border border-primary/30" : "bg-muted hover:bg-accent"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getNdviBg(state.ndvi)}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{state.name}</p>
                        <p className="text-xs text-muted-foreground">{state.majorCrops.map(c => c.name).join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getNdviColor(state.ndvi)}`}>{state.ndvi.toFixed(2)}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          {selectedState && (
            <div className="bg-card border border-border rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-foreground font-display mb-4">{t("satellite.detailTitle")} — {selectedState.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.ndviScore")}</p>
                  <p className={`text-3xl font-bold ${getNdviColor(selectedState.ndvi)}`}>{selectedState.ndvi.toFixed(2)}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.status")}</p>
                  <p className="text-lg font-bold text-foreground">{t(`satellite.${selectedState.statusKey}`)}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.areaMonitored")}</p>
                  <p className="text-lg font-bold text-foreground">{selectedState.area}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.totalCrops") || "Major Crops"}</p>
                  <p className="text-lg font-bold text-foreground">{selectedState.majorCrops.length}</p>
                </div>
              </div>

              {/* Major Crops */}
              <h3 className="font-semibold text-foreground mb-3">{t("satellite.majorCrops") || "Major Crop Production"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {selectedState.majorCrops.map(crop => (
                  <div key={crop.name} className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h4 className="font-bold text-foreground text-sm">{crop.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{t("satellite.production") || "Production"}: <span className="font-semibold text-foreground">{crop.production}</span></p>
                    <p className="text-xs text-muted-foreground">{t("satellite.cropArea") || "Area"}: <span className="font-semibold text-foreground">{crop.area}</span></p>
                  </div>
                ))}
              </div>

              {/* Districts */}
              <h3 className="font-semibold text-foreground mb-3">{t("satellite.districts") || "District-wise Data"}</h3>
              <div className="space-y-2">
                {selectedState.districts.map(dist => (
                  <button key={dist.name} onClick={() => setSelectedDistrict(selectedDistrict?.name === dist.name ? null : dist)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all ${selectedDistrict?.name === dist.name ? "bg-accent border border-primary/20" : "bg-muted hover:bg-accent"}`}>
                    <div>
                      <p className="text-sm font-medium text-foreground">{dist.name}</p>
                      <p className="text-xs text-muted-foreground">{dist.crop} • {dist.area}</p>
                    </div>
                    <div className={`text-lg font-bold ${getNdviColor(dist.ndvi)}`}>{dist.ndvi.toFixed(2)}</div>
                  </button>
                ))}
              </div>

              {selectedDistrict && (
                <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2">{selectedDistrict.name} — {t("satellite.detailTitle")}</h4>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div><p className="text-xs text-muted-foreground">{t("satellite.ndviScore")}</p><p className={`text-xl font-bold ${getNdviColor(selectedDistrict.ndvi)}`}>{selectedDistrict.ndvi.toFixed(2)}</p></div>
                    <div><p className="text-xs text-muted-foreground">{t("satellite.cropGrown")}</p><p className="text-sm font-bold text-foreground">{selectedDistrict.crop}</p></div>
                    <div><p className="text-xs text-muted-foreground">{t("satellite.areaMonitored")}</p><p className="text-sm font-bold text-foreground">{selectedDistrict.area}</p></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedDistrict.ndvi >= 0.6 ? t("satellite.recVeryHealthy") :
                      selectedDistrict.ndvi >= 0.4 ? t("satellite.recHealthy") :
                        selectedDistrict.ndvi >= 0.2 ? t("satellite.recModerate") :
                          t("satellite.recSparse")}
                  </p>
                </div>
              )}

              <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-2">{t("satellite.recommendation")}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedState.ndvi >= 0.6 ? t("satellite.recVeryHealthy") :
                    selectedState.ndvi >= 0.4 ? t("satellite.recHealthy") :
                      selectedState.ndvi >= 0.2 ? t("satellite.recModerate") :
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
