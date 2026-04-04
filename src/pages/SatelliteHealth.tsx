import { useState, useEffect, useRef } from "react";
import { Satellite, Leaf, MapPin, Info, BarChart3, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Crop health scores
const stateHealthData: Record<string, { ndvi: number; statusKey: string; majorCrops: { name: string; production: string; area: string }[]; districts: { name: string; ndvi: number; crop: string; area: string }[] }> = {
  "Punjab": { ndvi: 0.7, statusKey: "veryHealthy", majorCrops: [{ name: "Wheat", production: "17.8 MT", area: "3.5M ha" }, { name: "Rice", production: "12.4 MT", area: "3.1M ha" }, { name: "Cotton", production: "0.8 MT", area: "0.3M ha" }], districts: [{ name: "Ludhiana", ndvi: 0.75, crop: "Wheat", area: "15,300 ha" }, { name: "Amritsar", ndvi: 0.68, crop: "Rice", area: "12,800 ha" }] },
  "Haryana": { ndvi: 0.7, statusKey: "veryHealthy", majorCrops: [{ name: "Wheat", production: "12.6 MT", area: "2.5M ha" }, { name: "Rice", production: "5.1 MT", area: "1.5M ha" }], districts: [{ name: "Karnal", ndvi: 0.7, crop: "Rice", area: "11,200 ha" }, { name: "Hisar", ndvi: 0.58, crop: "Wheat", area: "9,800 ha" }] },
  "Uttar Pradesh": { ndvi: 0.6, statusKey: "healthy", majorCrops: [{ name: "Wheat", production: "35.5 MT", area: "9.8M ha" }, { name: "Sugarcane", production: "175 MT", area: "2.2M ha" }, { name: "Rice", production: "15.2 MT", area: "5.8M ha" }], districts: [{ name: "Lucknow", ndvi: 0.6, crop: "Wheat", area: "10,200 ha" }, { name: "Agra", ndvi: 0.52, crop: "Potato", area: "8,900 ha" }] },
  "Rajasthan": { ndvi: 0.2, statusKey: "sparse", majorCrops: [{ name: "Mustard", production: "4.8 MT", area: "2.8M ha" }, { name: "Wheat", production: "10.5 MT", area: "3.1M ha" }, { name: "Bajra", production: "3.2 MT", area: "4.5M ha" }], districts: [{ name: "Alwar", ndvi: 0.28, crop: "Mustard", area: "7,400 ha" }, { name: "Jodhpur", ndvi: 0.12, crop: "Bajra", area: "5,100 ha" }] },
  "Gujarat": { ndvi: 0.5, statusKey: "healthy", majorCrops: [{ name: "Groundnut", production: "3.5 MT", area: "1.8M ha" }, { name: "Cotton", production: "8.8 MT", area: "2.7M ha" }], districts: [{ name: "Rajkot", ndvi: 0.58, crop: "Groundnut", area: "12,500 ha" }, { name: "Ahmedabad", ndvi: 0.42, crop: "Cotton", area: "8,200 ha" }] },
  "Madhya Pradesh": { ndvi: 0.6, statusKey: "healthy", majorCrops: [{ name: "Soybean", production: "5.6 MT", area: "5.2M ha" }, { name: "Wheat", production: "19.6 MT", area: "5.8M ha" }], districts: [{ name: "Indore", ndvi: 0.58, crop: "Soybean", area: "8,200 ha" }, { name: "Bhopal", ndvi: 0.52, crop: "Wheat", area: "7,600 ha" }] },
  "West Bengal": { ndvi: 0.6, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "15.8 MT", area: "5.6M ha" }, { name: "Jute", production: "8.2 MT", area: "0.6M ha" }], districts: [{ name: "Burdwan", ndvi: 0.68, crop: "Rice", area: "14,200 ha" }, { name: "Hooghly", ndvi: 0.55, crop: "Potato", area: "8,600 ha" }] },
  "Maharashtra": { ndvi: 0.5, statusKey: "healthy", majorCrops: [{ name: "Sugarcane", production: "95.5 MT", area: "1.2M ha" }, { name: "Cotton", production: "7.2 MT", area: "4.2M ha" }, { name: "Onion", production: "9.8 MT", area: "0.5M ha" }], districts: [{ name: "Nashik", ndvi: 0.48, crop: "Onion", area: "6,800 ha" }, { name: "Pune", ndvi: 0.52, crop: "Sugarcane", area: "9,500 ha" }] },
  "Telangana": { ndvi: 0.4, statusKey: "moderate", majorCrops: [{ name: "Rice", production: "8.5 MT", area: "2.1M ha" }, { name: "Cotton", production: "5.2 MT", area: "1.8M ha" }], districts: [{ name: "Nizamabad", ndvi: 0.45, crop: "Turmeric", area: "5,200 ha" }, { name: "Warangal", ndvi: 0.40, crop: "Rice", area: "9,800 ha" }] },
  "Andhra Pradesh": { ndvi: 0.4, statusKey: "moderate", majorCrops: [{ name: "Rice", production: "12.8 MT", area: "2.3M ha" }, { name: "Chilli", production: "1.8 MT", area: "0.2M ha" }], districts: [{ name: "Guntur", ndvi: 0.32, crop: "Chilli", area: "9,100 ha" }, { name: "Krishna", ndvi: 0.42, crop: "Rice", area: "11,500 ha" }] },
  "Karnataka": { ndvi: 0.5, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "4.2 MT", area: "1.5M ha" }, { name: "Ragi", production: "2.1 MT", area: "0.8M ha" }, { name: "Coffee", production: "0.23 MT", area: "0.4M ha" }], districts: [{ name: "Kolar", ndvi: 0.35, crop: "Tomato", area: "4,600 ha" }, { name: "Mysuru", ndvi: 0.55, crop: "Rice", area: "8,400 ha" }] },
  "Tamil Nadu": { ndvi: 0.6, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "8.2 MT", area: "1.8M ha" }, { name: "Sugarcane", production: "35.2 MT", area: "0.3M ha" }], districts: [{ name: "Thanjavur", ndvi: 0.65, crop: "Rice", area: "11,200 ha" }, { name: "Coimbatore", ndvi: 0.52, crop: "Sugarcane", area: "7,800 ha" }] },
  "Kerala": { ndvi: 0.8, statusKey: "veryHealthy", majorCrops: [{ name: "Coconut", production: "5.9B nuts", area: "0.77M ha" }, { name: "Rubber", production: "0.54 MT", area: "0.55M ha" }], districts: [{ name: "Wayanad", ndvi: 0.82, crop: "Coffee", area: "3,200 ha" }, { name: "Thrissur", ndvi: 0.75, crop: "Rice", area: "5,100 ha" }] },
  "Bihar": { ndvi: 0.55, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "8.2 MT", area: "3.2M ha" }, { name: "Wheat", production: "6.5 MT", area: "2.1M ha" }], districts: [{ name: "Patna", ndvi: 0.58, crop: "Rice", area: "9,200 ha" }] },
  "Odisha": { ndvi: 0.52, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "9.8 MT", area: "4.2M ha" }], districts: [{ name: "Cuttack", ndvi: 0.55, crop: "Rice", area: "8,100 ha" }] },
  "Jharkhand": { ndvi: 0.45, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "4.5 MT", area: "1.8M ha" }], districts: [{ name: "Ranchi", ndvi: 0.48, crop: "Rice", area: "5,200 ha" }] },
  "Chhattisgarh": { ndvi: 0.58, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "8.5 MT", area: "3.8M ha" }], districts: [{ name: "Raipur", ndvi: 0.6, crop: "Rice", area: "10,200 ha" }] },
  "Assam": { ndvi: 0.65, statusKey: "healthy", majorCrops: [{ name: "Tea", production: "0.7 MT", area: "0.3M ha" }, { name: "Rice", production: "5.2 MT", area: "2.5M ha" }], districts: [{ name: "Jorhat", ndvi: 0.7, crop: "Tea", area: "4,500 ha" }] },
  "Uttarakhand": { ndvi: 0.62, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "0.6 MT", area: "0.3M ha" }, { name: "Wheat", production: "0.8 MT", area: "0.4M ha" }], districts: [{ name: "Dehradun", ndvi: 0.65, crop: "Rice", area: "3,200 ha" }] },
  "Himachal Pradesh": { ndvi: 0.68, statusKey: "veryHealthy", majorCrops: [{ name: "Apple", production: "0.5 MT", area: "0.1M ha" }], districts: [{ name: "Shimla", ndvi: 0.72, crop: "Apple", area: "2,800 ha" }] },
  "Jammu & Kashmir": { ndvi: 0.6, statusKey: "healthy", majorCrops: [{ name: "Apple", production: "1.8 MT", area: "0.16M ha" }, { name: "Rice", production: "0.5 MT", area: "0.3M ha" }], districts: [{ name: "Srinagar", ndvi: 0.62, crop: "Apple", area: "3,500 ha" }] },
  "Goa": { ndvi: 0.55, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "0.12 MT", area: "0.04M ha" }, { name: "Cashew", production: "0.025 MT", area: "0.055M ha" }], districts: [{ name: "South Goa", ndvi: 0.58, crop: "Rice", area: "1,200 ha" }] },
  "Tripura": { ndvi: 0.6, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "0.8 MT", area: "0.25M ha" }], districts: [{ name: "Agartala", ndvi: 0.62, crop: "Rice", area: "2,100 ha" }] },
  "Meghalaya": { ndvi: 0.7, statusKey: "veryHealthy", majorCrops: [{ name: "Rice", production: "0.3 MT", area: "0.1M ha" }], districts: [{ name: "Shillong", ndvi: 0.72, crop: "Rice", area: "1,800 ha" }] },
  "Manipur": { ndvi: 0.58, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "0.5 MT", area: "0.2M ha" }], districts: [{ name: "Imphal", ndvi: 0.6, crop: "Rice", area: "2,500 ha" }] },
  "Mizoram": { ndvi: 0.65, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "0.15 MT", area: "0.05M ha" }], districts: [{ name: "Aizawl", ndvi: 0.68, crop: "Rice", area: "1,500 ha" }] },
  "Nagaland": { ndvi: 0.6, statusKey: "healthy", majorCrops: [{ name: "Rice", production: "0.4 MT", area: "0.15M ha" }], districts: [{ name: "Kohima", ndvi: 0.62, crop: "Rice", area: "1,800 ha" }] },
  "Arunachal Pradesh": { ndvi: 0.75, statusKey: "veryHealthy", majorCrops: [{ name: "Rice", production: "0.25 MT", area: "0.12M ha" }], districts: [{ name: "Itanagar", ndvi: 0.78, crop: "Rice", area: "1,200 ha" }] },
  "Sikkim": { ndvi: 0.72, statusKey: "veryHealthy", majorCrops: [{ name: "Cardamom", production: "0.005 MT", area: "0.01M ha" }], districts: [{ name: "Gangtok", ndvi: 0.75, crop: "Cardamom", area: "800 ha" }] },
};

// GeoJSON name mapping (different datasets use different names)
const nameMap: Record<string, string> = {
  "Jammu and Kashmir": "Jammu & Kashmir",
  "NCT of Delhi": "Delhi",
  "Dadra and Nagar Haveli": "Dadra & Nagar Haveli",
  "Daman and Diu": "Daman & Diu",
  "Andaman and Nicobar": "Andaman & Nicobar",
};

const GEOJSON_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

const getNdviColor = (ndvi: number) => {
  if (ndvi >= 0.6) return "#22c55e";
  if (ndvi >= 0.3) return "#eab308";
  return "#ef4444";
};

const getNdviColorClass = (ndvi: number) => {
  if (ndvi >= 0.6) return "text-green-500";
  if (ndvi >= 0.4) return "text-lime-500";
  if (ndvi >= 0.2) return "text-yellow-500";
  return "text-red-500";
};

const getNdviBg = (ndvi: number) => {
  if (ndvi >= 0.6) return "bg-green-500";
  if (ndvi >= 0.4) return "bg-lime-500";
  if (ndvi >= 0.2) return "bg-yellow-500";
  return "bg-red-500";
};

const ndviLegend = [
  { range: "0.0 – 0.3", label: "Poor", color: "bg-red-500" },
  { range: "0.3 – 0.6", label: "Moderate", color: "bg-yellow-500" },
  { range: "0.6 – 1.0", label: "Good", color: "bg-green-500" },
];

const SatelliteHealth = () => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [geoLoaded, setGeoLoaded] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const stateNames = Object.keys(stateHealthData);
  const filtered = stateNames.filter(s => s.toLowerCase().includes(search.toLowerCase()));
  const avgNdvi = (stateNames.reduce((sum, s) => sum + stateHealthData[s].ndvi, 0) / stateNames.length).toFixed(2);
  const healthyCount = stateNames.filter(s => stateHealthData[s].ndvi >= 0.6).length;
  const moderateCount = stateNames.filter(s => stateHealthData[s].ndvi >= 0.3 && stateHealthData[s].ndvi < 0.6).length;
  const poorCount = stateNames.filter(s => stateHealthData[s].ndvi < 0.3).length;

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        center: [22.5, 82],
        zoom: 5,
        minZoom: 4,
        maxZoom: 8,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: false,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      // Simple tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
      }).addTo(map);

      leafletMapRef.current = map;

      // Fetch GeoJSON
      try {
        const res = await fetch(GEOJSON_URL);
        const data = await res.json();

        const geoLayer = L.geoJSON(data, {
          style: (feature: any) => {
            const rawName = feature?.properties?.NAME_1 || feature?.properties?.name || feature?.properties?.NAME || "";
            const name = nameMap[rawName] || rawName;
            const health = stateHealthData[name];
            const ndvi = health?.ndvi ?? 0.3;
            return {
              fillColor: getNdviColor(ndvi),
              fillOpacity: 0.6,
              color: "#ffffff",
              weight: 1.5,
              opacity: 0.8,
            };
          },
          onEachFeature: (feature: any, layer: any) => {
            const rawName = feature?.properties?.NAME_1 || feature?.properties?.name || feature?.properties?.NAME || "";
            const name = nameMap[rawName] || rawName;
            const health = stateHealthData[name];
            const ndvi = health?.ndvi ?? 0;
            const label = ndvi >= 0.6 ? "Good" : ndvi >= 0.3 ? "Moderate" : "Poor";

            layer.bindTooltip(
              `<div style="font-family:Inter,sans-serif;padding:4px 8px"><strong>${name}</strong><br/>Health Score: ${ndvi.toFixed(1)} (${label})</div>`,
              { sticky: true, className: "leaflet-tooltip-custom" }
            );

            layer.on({
              mouseover: (e: any) => {
                e.target.setStyle({ fillOpacity: 0.85, weight: 2.5, color: "#1a1a1a" });
                e.target.bringToFront();
                setHoveredState(name);
              },
              mouseout: (e: any) => {
                geoLayer.resetStyle(e.target);
                if (selectedState === name) {
                  e.target.setStyle({ fillOpacity: 0.9, weight: 3, color: "#000" });
                }
                setHoveredState(null);
              },
              click: () => {
                setSelectedState(prev => prev === name ? null : name);
              },
            });
          },
        }).addTo(map);

        geoLayerRef.current = geoLayer;
        map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
        setGeoLoaded(true);
      } catch (err) {
        console.error("Failed to load GeoJSON:", err);
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Highlight selected state on map
  useEffect(() => {
    if (!geoLayerRef.current) return;
    geoLayerRef.current.eachLayer((layer: any) => {
      const rawName = layer.feature?.properties?.NAME_1 || layer.feature?.properties?.name || layer.feature?.properties?.NAME || "";
      const name = nameMap[rawName] || rawName;
      if (name === selectedState) {
        layer.setStyle({ fillOpacity: 0.9, weight: 3, color: "#000" });
        layer.bringToFront();
      } else {
        geoLayerRef.current.resetStyle(layer);
      }
    });
  }, [selectedState]);

  const selectedData = selectedState ? stateHealthData[selectedState] : null;

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <Satellite className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground font-display">{t("satellite.title")}</h1>
          </div>
          <p className="text-muted-foreground mb-8">{t("satellite.subtitle")}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: t("satellite.regionsMonitored"), value: stateNames.length, icon: MapPin },
              { label: t("satellite.avgNdvi"), value: avgNdvi, icon: BarChart3 },
              { label: t("satellite.healthyZones"), value: healthyCount, icon: Leaf },
              { label: t("satellite.stressedZones"), value: poorCount, icon: Info },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                <div><p className="text-xs text-muted-foreground mb-1">{s.label}</p><p className="text-2xl font-bold text-foreground">{String(s.value)}</p></div>
                <s.icon className="w-6 h-6 text-primary" />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="bg-card border border-border rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-foreground text-sm mb-3">Crop Health Legend</h3>
            <div className="flex flex-wrap gap-6">
              {ndviLegend.map(l => (
                <div key={l.range} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded ${l.color}`} />
                  <span className="text-sm text-muted-foreground">{l.range} — <strong>{l.label}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Map + State List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Map */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 overflow-hidden">
              <h3 className="font-bold text-foreground mb-3 px-2">{t("satellite.mapTitle") || "India Crop Health Map"}</h3>
              <div ref={mapRef} className="w-full rounded-xl overflow-hidden" style={{ height: "520px" }} />
              {!geoLoaded && (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">Loading map data...</div>
              )}
            </div>

            {/* State List */}
            <div className="bg-card border border-border rounded-2xl p-4 overflow-y-auto" style={{ maxHeight: "600px" }}>
              <h3 className="font-bold text-foreground mb-3">{t("satellite.stateList") || "States Overview"}</h3>
              <div className="mb-3">
                <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder={t("satellite.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
                </div>
              </div>
              <div className="space-y-1.5">
                {filtered.map(name => {
                  const data = stateHealthData[name];
                  return (
                    <button key={name} onClick={() => setSelectedState(prev => prev === name ? null : name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${selectedState === name ? "bg-primary/10 border border-primary/30" : "bg-muted hover:bg-accent"}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getNdviBg(data.ndvi)}`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{name}</p>
                          <p className="text-xs text-muted-foreground">{data.majorCrops.map(c => c.name).join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-bold ${getNdviColorClass(data.ndvi)}`}>{data.ndvi.toFixed(1)}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          {selectedState && selectedData && (
            <div className="bg-card border border-border rounded-2xl p-8 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-foreground font-display mb-4">{selectedState} — Crop Health Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.ndviScore")}</p>
                  <p className={`text-3xl font-bold ${getNdviColorClass(selectedData.ndvi)}`}>{selectedData.ndvi.toFixed(2)}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("satellite.status")}</p>
                  <p className="text-lg font-bold text-foreground">{selectedData.ndvi >= 0.6 ? "Good" : selectedData.ndvi >= 0.3 ? "Moderate" : "Poor"}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Major Crops</p>
                  <p className="text-lg font-bold text-foreground">{selectedData.majorCrops.length}</p>
                </div>
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Districts</p>
                  <p className="text-lg font-bold text-foreground">{selectedData.districts.length}</p>
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-3">Major Crop Production</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {selectedData.majorCrops.map(crop => (
                  <div key={crop.name} className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h4 className="font-bold text-foreground text-sm">{crop.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Production: <span className="font-semibold text-foreground">{crop.production}</span></p>
                    <p className="text-xs text-muted-foreground">Area: <span className="font-semibold text-foreground">{crop.area}</span></p>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-foreground mb-3">District-wise Data</h3>
              <div className="space-y-2 mb-6">
                {selectedData.districts.map(dist => (
                  <div key={dist.name} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-foreground">{dist.name}</p>
                      <p className="text-xs text-muted-foreground">{dist.crop} • {dist.area}</p>
                    </div>
                    <span className={`text-lg font-bold ${getNdviColorClass(dist.ndvi)}`}>{dist.ndvi.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-2">{t("satellite.recommendation")}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedData.ndvi >= 0.6 ? t("satellite.recVeryHealthy") :
                    selectedData.ndvi >= 0.4 ? t("satellite.recHealthy") :
                      selectedData.ndvi >= 0.2 ? t("satellite.recModerate") :
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
