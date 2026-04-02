import { useState, useEffect } from "react";
import { CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, MapPin, Search, CheckCircle, Loader2, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface WeatherData {
  city: string; temp: number; feelsLike: number; humidity: number; wind: number; condition: string; icon: string; description: string;
  pressure: number; visibility: number;
}
interface ForecastDay { day: string; date: string; temp: number; low: number; condition: string; icon: string; humidity: number; }

const getWeatherIcon = (iconCode: string) => {
  if (iconCode?.includes("01")) return Sun;
  if (iconCode?.includes("02") || iconCode?.includes("03")) return Cloud;
  if (iconCode?.includes("04")) return CloudSun;
  if (iconCode?.includes("09") || iconCode?.includes("10") || iconCode?.includes("11")) return CloudRain;
  return Cloud;
};

const getAdvisory = (condition: string, temp: number, t: (key: string) => string) => {
  if (condition.includes("Rain")) return t("weather.advisoryRain");
  if (temp > 38) return t("weather.advisoryHeat");
  if (temp < 10) return t("weather.advisoryCold");
  if (condition === "Clear" && temp > 25 && temp < 35) return t("weather.advisoryGood");
  return t("weather.advisoryModerate");
};

const Weather = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("Kalol");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  const API_KEY = "bd5e378503939ddaee76f12ad7a97608";

  const fetchWeather = async (query: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=metric`);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setCity(data.name);
      setWeather({
        city: data.name, temp: Math.round(data.main.temp), feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity, wind: data.wind.speed, condition: data.weather[0].main,
        icon: data.weather[0].icon, description: data.weather[0].description,
        pressure: data.main.pressure, visibility: Math.round((data.visibility || 10000) / 1000),
      });

      const fRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${API_KEY}&units=metric`);
      const fData = await fRes.json();
      const daily: ForecastDay[] = [];
      const seen = new Set<string>();
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (const item of fData.list) {
        const date = item.dt_txt.split(" ")[0];
        if (!seen.has(date) && daily.length < 7) {
          seen.add(date);
          const d = new Date(item.dt_txt);
          daily.push({
            day: daily.length === 0 ? t("weather.tomorrow") : dayNames[d.getDay()],
            date: `${d.getDate()}/${d.getMonth() + 1}`,
            temp: Math.round(item.main.temp_max), low: Math.round(item.main.temp_min),
            condition: item.weather[0].main, icon: item.weather[0].icon, humidity: item.main.humidity,
          });
        }
      }
      setForecast(daily);
    } catch {
      setError(t("weather.error"));
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported"); return; }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { fetchWeather(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`); setDetectingLocation(false); },
      () => { setError("Location access denied. Search manually."); setDetectingLocation(false); }
    );
  };

  useEffect(() => { detectLocation(); }, []);

  const handleSearch = () => fetchWeather(`q=${city}`);
  const displayWeather = weather;
  const WeatherIcon = displayWeather ? getWeatherIcon(displayWeather.icon) : Sun;

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("weather.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("weather.subtitle")}</p>

          <div className="flex gap-3 mb-8">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 flex-1 max-w-md">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("weather.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
            </div>
            <button onClick={handleSearch} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
            <button onClick={detectLocation} disabled={detectingLocation} className="bg-card border border-border text-foreground px-4 py-2.5 rounded-lg hover:bg-muted transition-colors">
              {detectingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
            </button>
          </div>

          {error && <p className="text-destructive text-sm mb-4">{error}</p>}

          {displayWeather ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="md:col-span-3 bg-card border border-border rounded-2xl p-8 bg-gradient-to-br from-accent/30 to-transparent">
                  <p className="text-sm text-primary font-medium mb-1">{t("weather.currentWeather")}</p>
                  <div className="flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4 text-foreground" />
                    <span className="font-bold text-foreground text-lg">{displayWeather.city}</span>
                  </div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="text-6xl font-bold text-foreground">{displayWeather.temp}°</div>
                      <div className="text-foreground font-semibold mt-1 capitalize">{displayWeather.description}</div>
                      <div className="text-muted-foreground text-sm">{t("weather.feelsLike")} {displayWeather.feelsLike}°C</div>
                    </div>
                    <WeatherIcon className="w-16 h-16 text-secondary" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: Droplets, label: t("weather.humidityLabel"), value: `${displayWeather.humidity}%`, color: "text-blue-500" },
                      { icon: Wind, label: t("weather.windLabel"), value: `${displayWeather.wind} m/s`, color: "text-muted-foreground" },
                      { icon: Sun, label: t("weather.pressure"), value: `${displayWeather.pressure} hPa`, color: "text-secondary" },
                      { icon: Cloud, label: t("weather.visibility"), value: `${displayWeather.visibility} km`, color: "text-primary" },
                    ].map((item) => (
                      <div key={item.label} className="bg-muted/60 rounded-xl p-3 text-center">
                        <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-1`} />
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="font-bold text-foreground text-sm">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 bg-card border border-border rounded-2xl p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground text-lg font-display">{t("weather.farmingAdvisory")}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{t("weather.advisorySubtitle")}</p>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-sm text-foreground leading-relaxed">{getAdvisory(displayWeather.condition, displayWeather.temp, t)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-xl font-bold text-foreground font-display mb-1">{t("weather.fiveDayForecast")}</h2>
                <p className="text-muted-foreground text-sm mb-6">{t("weather.planAhead")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {forecast.map((day) => {
                    const DayIcon = getWeatherIcon(day.icon);
                    return (
                      <div key={day.date} className="bg-muted/50 rounded-xl p-4 text-center">
                        <div className="font-semibold text-foreground text-sm mb-1">{day.day}</div>
                        <div className="text-xs text-muted-foreground mb-2">{day.date}</div>
                        <DayIcon className="w-8 h-8 mx-auto mb-2 text-secondary" />
                        <div className="text-xl font-bold text-foreground">{day.temp}°</div>
                        <div className="text-xs text-muted-foreground">{day.low}°</div>
                        <div className="text-xs text-muted-foreground mt-1">{day.humidity}%💧</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : !loading && (
            <div className="bg-card border border-border rounded-2xl p-16 text-center">
              <CloudSun className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Search for a city or allow location access to see weather</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Weather;
