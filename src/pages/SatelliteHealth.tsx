import { useState, useEffect, useRef } from "react";
import { Satellite, Leaf, MapPin, Info, BarChart3, ChevronRight, CloudRain, Thermometer, Wind, Droplets } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Crop health scores
const stateHealthData: Record<string, { ndvi: number; statusKey: string; lat: number; lng: number; majorCrops: { name: string; production: string; area: string }[]; districts: { name: string; ndvi: number; crop: string; area: string }[] }> = {
  "Punjab": { ndvi: 0.7, statusKey: "veryHealthy", lat: 31.1471, lng: 75.3412, majorCrops: [{ name: "Wheat", production: "17.8 MT", area: "3.5M ha" }, { name: "Rice", production: "12.4 MT", area: "3.1M ha" }, { name: "Cotton", production: "0.8 MT", area: "0.3M ha" }], districts: [{ name: "Ludhiana", ndvi: 0.75, crop: "Wheat", area: "15,300 ha" }, { name: "Amritsar", ndvi: 0.68, crop: "Rice", area: "12,800 ha" }] },
  "Haryana": { ndvi: 0.7, statusKey: "veryHealthy", lat: 29.0588, lng: 76.0856, majorCrops: [{ name: "Wheat", production: "12.6 MT", area: "2.5M ha" }, { name: "Rice", production: "5.1 MT", area: "1.5M ha" }], districts: [{ name: "Karnal", ndvi: 0.7, crop: "Rice", area: "11,200 ha" }, { name: "Hisar", ndvi: 0.58, crop: "Wheat", area: "9,800 ha" }] },
  "Uttar Pradesh": { ndvi: 0.6, statusKey: "healthy", lat: 26.8467, lng: 80.9462, majorCrops: [{ name: "Wheat", production: "35.5 MT", area: "9.8M ha" }, { name: "Sugarcane", production: "175 MT", area: "2.2M ha" }, { name: "Rice", production: "15.2 MT", area: "5.8M ha" }], districts: [{ name: "Lucknow", ndvi: 0.6, crop: "Wheat", area: "10,200 ha" }, { name: "Agra", ndvi: 0.52, crop: "Potato", area: "8,900 ha" }] },
  "Rajasthan": { ndvi: 0.2, statusKey: "sparse", lat: 27.0238, lng: 74.2179, majorCrops: [{ name: "Mustard", production: "4.8 MT", area: "2.8M ha" }, { name: "Wheat", production: "10.5 MT", area: "3.1M ha" }, { name: "Bajra", production: "3.2 MT", area: "4.5M ha" }], districts: [{ name: "Alwar", ndvi: 0.28, crop: "Mustard", area: "7,400 ha" }, { name: "Jodhpur", ndvi: 0.12, crop: "Bajra", area: "5,100 ha" }] },
  "Gujarat": { ndvi: 0.5, statusKey: "healthy", lat: 22.2587, lng: 71.1924, majorCrops: [{ name: "Groundnut", production: "3.5 MT", area: "1.8M ha" }, { name: "Cotton", production: "8.8 MT", area: "2.7M ha" }], districts: [{ name: "Rajkot", ndvi: 0.58, crop: "Groundnut", area: "12,500 ha" }, { name: "Ahmedabad", ndvi: 0.42, crop: "Cotton", area: "8,200 ha" }] },
  "Madhya Pradesh": { ndvi: 0.6, statusKey: "healthy", lat: 23.4734, lng: 77.9479, majorCrops: [{ name: "Soybean", production: "5.6 MT", area: "5.2M ha" }, { name: "Wheat", production: "19.6 MT", area: "5.8M ha" }], districts: [{ name: "Indore", ndvi: 0.58, crop: "Soybean", area: "8,200 ha" }, { name: "Bhopal", ndvi: 0.52, crop: "Wheat", area: "7,600 ha" }] },
  "West Bengal": { ndvi: 0.6, statusKey: "healthy", lat: 22.9868, lng: 87.855, majorCrops: [{ name: "Rice", production: "15.8 MT", area: "5.6M ha" }, { name: "Jute", production: "8.2 MT", area: "0.6M ha" }], districts: [{ name: "Burdwan", ndvi: 0.68, crop: "Rice", area: "14,200 ha" }, { name: "Hooghly", ndvi: 0.55, crop: "Potato", area: "8,600 ha" }] },
  "Maharashtra": { ndvi: 0.5, statusKey: "healthy", lat: 19.7515, lng: 75.7139, majorCrops: [{ name: "Sugarcane", production: "95.5 MT", area: "1.2M ha" }, { name: "Cotton", production: "7.2 MT", area: "4.2M ha" }, { name: "Onion", production: "9.8 MT", area: "0.5M ha" }], districts: [{ name: "Nashik", ndvi: 0.48, crop: "Onion", area: "6,800 ha" }, { name: "Pune", ndvi: 0.52, crop: "Sugarcane", area: "9,500 ha" }] },
  "Telangana": { ndvi: 0.4, statusKey: "moderate", lat: 18.1124, lng: 79.0193, majorCrops: [{ name: "Rice", production: "8.5 MT", area: "2.1M ha" }, { name: "Cotton", production: "5.2 MT", area: "1.8M ha" }], districts: [{ name: "Nizamabad", ndvi: 0.45, crop: "Turmeric", area: "5,200 ha" }, { name: "Warangal", ndvi: 0.40, crop: "Rice", area: "9,800 ha" }] },
  "Andhra Pradesh": { ndvi: 0.4, statusKey: "moderate", lat: 15.9129, lng: 79.74, majorCrops: [{ name: "Rice", production: "12.8 MT", area: "2.3M ha" }, { name: "Chilli", production: "1.8 MT", area: "0.2M ha" }], districts: [{ name: "Guntur", ndvi: 0.32, crop: "Chilli", area: "9,100 ha" }, { name: "Krishna", ndvi: 0.42, crop: "Rice", area: "11,500 ha" }] },
  "Karnataka": { ndvi: 0.5, statusKey: "healthy", lat: 15.3173, lng: 75.7139, majorCrops: [{ name: "Rice", production: "4.2 MT", area: "1.5M ha" }, { name: "Ragi", production: "2.1 MT", area: "0.8M ha" }, { name: "Coffee", production: "0.23 MT", area: "0.4M ha" }], districts: [{ name: "Kolar", ndvi: 0.35, crop: "Tomato", area: "4,600 ha" }, { name: "Mysuru", ndvi: 0.55, crop: "Rice", area: "8,400 ha" }] },
  "Tamil Nadu": { ndvi: 0.6, statusKey: "healthy", lat: 11.1271, lng: 78.6569, majorCrops: [{ name: "Rice", production: "8.2 MT", area: "1.8M ha" }, { name: "Sugarcane", production: "35.2 MT", area: "0.3M ha" }], districts: [{ name: "Thanjavur", ndvi: 0.65, crop: "Rice", area: "11,200 ha" }, { name: "Coimbatore", ndvi: 0.52, crop: "Sugarcane", area: "7,800 ha" }] },
  "Kerala": { ndvi: 0.8, statusKey: "veryHealthy", lat: 10.8505, lng: 76.2711, majorCrops: [{ name: "Coconut", production: "5.9B nuts", area: "0.77M ha" }, { name: "Rubber", production: "0.54 MT", area: "0.55M ha" }], districts: [{ name: "Wayanad", ndvi: 0.82, crop: "Coffee", area: "3,200 ha" }, { name: "Thrissur", ndvi: 0.75, crop: "Rice", area: "5,100 ha" }] },
  "Bihar": { ndvi: 0.55, statusKey: "healthy", lat: 25.0961, lng: 85.3131, majorCrops: [{ name: "Rice", production: "8.2 MT", area: "3.2M ha" }, { name: "Wheat", production: "6.5 MT", area: "2.1M ha" }], districts: [{ name: "Patna", ndvi: 0.58, crop: "Rice", area: "9,200 ha" }] },
  "Odisha": { ndvi: 0.52, statusKey: "healthy", lat: 20.9517, lng: 85.0985, majorCrops: [{ name: "Rice", production: "9.8 MT", area: "4.2M ha" }], districts: [{ name: "Cuttack", ndvi: 0.55, crop: "Rice", area: "8,100 ha" }] },
  "Jharkhand": { ndvi: 0.45, statusKey: "healthy", lat: 23.6102, lng: 85.2799, majorCrops: [{ name: "Rice", production: "4.5 MT", area: "1.8M ha" }], districts: [{ name: "Ranchi", ndvi: 0.48, crop: "Rice", area: "5,200 ha" }] },
  "Chhattisgarh": { ndvi: 0.58, statusKey: "healthy", lat: 21.2787, lng: 81.8661, majorCrops: [{ name: "Rice", production: "8.5 MT", area: "3.8M ha" }], districts: [{ name: "Raipur", ndvi: 0.6, crop: "Rice", area: "10,200 ha" }] },
  "Assam": { ndvi: 0.65, statusKey: "healthy", lat: 26.2006, lng: 92.9376, majorCrops: [{ name: "Tea", production: "0.7 MT", area: "0.3M ha" }, { name: "Rice", production: "5.2 MT", area: "2.5M ha" }], districts: [{ name: "Jorhat", ndvi: 0.7, crop: "Tea", area: "4,500 ha" }] },
  "Uttarakhand": { ndvi: 0.62, statusKey: "healthy", lat: 30.0668, lng: 79.0193, majorCrops: [{ name: "Rice", production: "0.6 MT", area: "0.3M ha" }, { name: "Wheat", production: "0.8 MT", area: "0.4M ha" }], districts: [{ name: "Dehradun", ndvi: 0.65, crop: "Rice", area: "3,200 ha" }] },
  "Himachal Pradesh": { ndvi: 0.68, statusKey: "veryHealthy", lat: 31.1048, lng: 77.1734, majorCrops: [{ name: "Apple", production: "0.5 MT", area: "0.1M ha" }], districts: [{ name: "Shimla", ndvi: 0.72, crop: "Apple", area: "2,800 ha" }] },
  "Jammu & Kashmir": { ndvi: 0.6, statusKey: "healthy", lat: 33.7782, lng: 76.5762, majorCrops: [{ name: "Apple", production: "1.8 MT", area: "0.16M ha" }, { name: "Rice", production: "0.5 MT", area: "0.3M ha" }], districts: [{ name: "Srinagar", ndvi: 0.62, crop: "Apple", area: "3,500 ha" }] },
  "Goa": { ndvi: 0.55, statusKey: "healthy", lat: 15.2993, lng: 74.124, majorCrops: [{ name: "Rice", production: "0.12 MT", area: "0.04M ha" }, { name: "Cashew", production: "0.025 MT", area: "0.055M ha" }], districts: [{ name: "South Goa", ndvi: 0.58, crop: "Rice", area: "1,200 ha" }] },
  "Tripura": { ndvi: 0.6, statusKey: "healthy", lat: 23.9408, lng: 91.9882, majorCrops: [{ name: "Rice", production: "0.8 MT", area: "0.25M ha" }], districts: [{ name: "Agartala", ndvi: 0.62, crop: "Rice", area: "2,100 ha" }] },
  "Meghalaya": { ndvi: 0.7, statusKey: "veryHealthy", lat: 25.467, lng: 91.3662, majorCrops: [{ name: "Rice", production: "0.3 MT", area: "0.1M ha" }], districts: [{ name: "Shillong", ndvi: 0.72, crop: "Rice", area: "1,800 ha" }] },
  "Manipur": { ndvi: 0.58, statusKey: "healthy", lat: 24.6637, lng: 93.9063, majorCrops: [{ name: "Rice", production: "0.5 MT", area: "0.2M ha" }], districts: [{ name: "Imphal", ndvi: 0.6, crop: "Rice", area: "2,500 ha" }] },
  "Mizoram": { ndvi: 0.65, statusKey: "healthy", lat: 23.1645, lng: 92.9376, majorCrops: [{ name: "Rice", production: "0.15 MT", area: "0.05M ha" }], districts: [{ name: "Aizawl", ndvi: 0.68, crop: "Rice", area: "1,500 ha" }] },
  "Nagaland": { ndvi: 0.6, statusKey: "healthy", lat: 26.1584, lng: 94.5624, majorCrops: [{ name: "Rice", production: "0.4 MT", area: "0.15M ha" }], districts: [{ name: "Kohima", ndvi: 0.62, crop: "Rice", area: "1,800 ha" }] },
  "Arunachal Pradesh": { ndvi: 0.75, statusKey: "veryHealthy", lat: 28.218, lng: 94.7278, majorCrops: [{ name: "Rice", production: "0.25 MT", area: "0.12M ha" }], districts: [{ name: "Itanagar", ndvi: 0.78, crop: "Rice", area: "1,200 ha" }] },
  "Sikkim": { ndvi: 0.72, statusKey: "veryHealthy", lat: 27.533, lng: 88.5122, majorCrops: [{ name: "Cardamom", production: "0.005 MT", area: "0.01M ha" }], districts: [{ name: "Gangtok", ndvi: 0.75, crop: "Cardamom", area: "800 ha" }] },
};

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

interface WeatherData {
  temp: number;
  humidity: number;
  wind: number;
  rain: number;
  description: string;
}

const SatelliteHealth = () => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);
  const weatherMarkersRef = useRef<any[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [geoLoaded, setGeoLoaded] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [weatherCache, setWeatherCache] = useState<Record<string, WeatherData>>({});
  const [weatherLoading, setWeatherLoading] = useState(false);

  const stateNames = Object.keys(stateHealthData);
  const filtered = stateNames.filter(s => s.toLowerCase().includes(search.toLowerCase()));
  const avgNdvi = (stateNames.reduce((sum, s) => sum + stateHealthData[s].ndvi, 0) / stateNames.length).toFixed(2);
  const healthyCount = stateNames.filter(s => stateHealthData[s].ndvi >= 0.6).length;
  const poorCount = stateNames.filter(s => stateHealthData[s].ndvi < 0.3).length;

  // Fetch weather for major state capitals
  const fetchWeatherData = async () => {
    setWeatherLoading(true);
    const majorStates = ["Punjab", "Rajasthan", "Maharashtra", "Tamil Nadu", "Kerala", "West Bengal", "Uttar Pradesh", "Gujarat", "Karnataka", "Madhya Pradesh", "Bihar", "Assam"];
    const newCache: Record<string, WeatherData> = {};

    await Promise.all(majorStates.map(async (state) => {
      const d = stateHealthData[state];
      if (!d) return;
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,rain&timezone=Asia/Kolkata`);
        const json = await res.json();
        if (json.current) {
          newCache[state] = {
            temp: json.current.temperature_2m,
            humidity: json.current.relative_humidity_2m,
            wind: json.current.wind_speed_10m,
            rain: json.current.rain ?? 0,
            description: json.current.rain > 0 ? "Rainy" : json.current.temperature_2m > 35 ? "Hot" : json.current.temperature_2m < 15 ? "Cold" : "Clear",
          };
        }
      } catch {
        // skip failed
      }
    }));

    setWeatherCache(newCache);
    setWeatherLoading(false);
  };

  // Add weather markers to map
  const addWeatherMarkers = (L: any, map: any) => {
    // Clear old markers
    weatherMarkersRef.current.forEach(m => m.remove());
    weatherMarkersRef.current = [];

    Object.entries(weatherCache).forEach(([state, weather]) => {
      const d = stateHealthData[state];
      if (!d) return;

      const icon = L.divIcon({
        className: "weather-marker-icon",
        html: `<div style="background:rgba(0,0,0,0.7);color:white;padding:3px 6px;border-radius:6px;font-size:11px;font-family:Inter,sans-serif;white-space:nowrap;display:flex;align-items:center;gap:3px;backdrop-filter:blur(4px);">
          <span style="font-weight:600">${Math.round(weather.temp)}°C</span>
          ${weather.rain > 0 ? '<span>🌧</span>' : weather.temp > 35 ? '<span>☀️</span>' : '<span>⛅</span>'}
        </div>`,
        iconSize: [70, 24],
        iconAnchor: [35, 12],
      });

      const marker = L.marker([d.lat, d.lng], { icon, interactive: false }).addTo(map);
      weatherMarkersRef.current.push(marker);
    });
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  useEffect(() => {
    if (leafletMapRef.current && Object.keys(weatherCache).length > 0) {
      import("leaflet").then(L => {
        addWeatherMarkers(L, leafletMapRef.current);
      });
    }
  }, [weatherCache]);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const indiaBounds: [[number, number], [number, number]] = [[6.5, 68], [37.5, 97.5]];

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
        maxBounds: L.latLngBounds(indiaBounds[0], indiaBounds[1]),
        maxBoundsViscosity: 1.0,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        bounds: L.latLngBounds(indiaBounds[0], indiaBounds[1]),
      }).addTo(map);

      leafletMapRef.current = map;

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
            const w = weatherCache[name];
            const weatherLine = w ? `<br/>🌡 ${Math.round(w.temp)}°C | 💧 ${w.humidity}% | 💨 ${w.wind} km/h` : "";

            layer.bindTooltip(
              `<div style="font-family:Inter,sans-serif;padding:4px 8px"><strong>${name}</strong><br/>Health: ${ndvi.toFixed(1)} (${label})${weatherLine}</div>`,
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

        // Add weather markers after map loads
        if (Object.keys(weatherCache).length > 0) {
          addWeatherMarkers(L, map);
        }
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
  const selectedWeather = selectedState ? weatherCache[selectedState] : null;

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-3 mb-2">
            <Satellite className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground font-display">{t("satellite.title")}</h1>
          </div>
          <p className="text-muted-foreground mb-8">{t("satellite.subtitle")}</p>

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

          <div className="bg-card border border-border rounded-xl p-4 mb-8">
            <h3 className="font-semibold text-foreground text-sm mb-3">Crop Health Legend</h3>
            <div className="flex flex-wrap gap-6">
              {ndviLegend.map(l => (
                <div key={l.range} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded ${l.color}`} />
                  <span className="text-sm text-muted-foreground">{l.range} — <strong>{l.label}</strong></span>
                </div>
              ))}
              <div className="flex items-center gap-2 ml-4 border-l border-border pl-4">
                <span className="text-xs text-muted-foreground">🌡 = Live weather overlay</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="font-bold text-foreground">{t("satellite.mapTitle") || "India Crop Health Map"}</h3>
                {weatherLoading && <span className="text-xs text-muted-foreground animate-pulse">Loading weather...</span>}
              </div>
              <div ref={mapRef} className="w-full rounded-xl overflow-hidden" style={{ height: "520px" }} />
              {!geoLoaded && (
                <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">Loading map data...</div>
              )}
            </div>

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
                  const w = weatherCache[name];
                  return (
                    <button key={name} onClick={() => setSelectedState(prev => prev === name ? null : name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${selectedState === name ? "bg-primary/10 border border-primary/30" : "bg-muted hover:bg-accent"}`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getNdviBg(data.ndvi)}`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            {w ? `${Math.round(w.temp)}°C • ${w.humidity}%` : data.majorCrops.map(c => c.name).join(", ")}
                          </p>
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

          {selectedState && selectedData && (
            <div className="bg-card border border-border rounded-2xl p-8 mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-foreground font-display mb-4">{selectedState} — Crop Health Details</h2>

              {/* Weather info for selected state */}
              {selectedWeather && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="text-lg font-bold text-foreground">{Math.round(selectedWeather.temp)}°C</p>
                    </div>
                  </div>
                  <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-xl p-4 flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-cyan-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="text-lg font-bold text-foreground">{selectedWeather.humidity}%</p>
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
                    <Wind className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind</p>
                      <p className="text-lg font-bold text-foreground">{selectedWeather.wind} km/h</p>
                    </div>
                  </div>
                  <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-4 flex items-center gap-3">
                    <CloudRain className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rain</p>
                      <p className="text-lg font-bold text-foreground">{selectedWeather.rain} mm</p>
                    </div>
                  </div>
                </div>
              )}

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
