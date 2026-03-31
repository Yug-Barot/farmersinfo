import { useState } from "react";
import { CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, MapPin, Search, CheckCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  low: number;
  condition: string;
  icon: string;
}

const getWeatherIcon = (iconCode: string) => {
  if (iconCode?.includes("01")) return Sun;
  if (iconCode?.includes("02") || iconCode?.includes("03")) return Cloud;
  if (iconCode?.includes("04")) return CloudSun;
  if (iconCode?.includes("09") || iconCode?.includes("10") || iconCode?.includes("11")) return CloudRain;
  return Cloud;
};

const Weather = () => {
  const { t } = useTranslation();
  const [city, setCity] = useState("Kalol");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "bd5e378503939ddaee76f12ad7a97608";

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather({
        city: data.name,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
      });

      const fRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      const fData = await fRes.json();
      const daily: ForecastDay[] = [];
      const seen = new Set<string>();
      for (const item of fData.list) {
        const date = item.dt_txt.split(" ")[0];
        if (!seen.has(date) && daily.length < 5) {
          seen.add(date);
          daily.push({
            day: daily.length === 0 ? t("weather.tomorrow") : `${t("weather.day")} ${daily.length + 2}`,
            temp: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
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

  const displayWeather = weather || { city, temp: 27, feelsLike: 29, humidity: 55, wind: 3.5, condition: "Clear", icon: "01d" };
  const displayForecast = forecast.length > 0 ? forecast : [
    { day: t("weather.tomorrow"), temp: 30, low: 25, condition: "Cloudy", icon: "04d" },
    { day: `${t("weather.day")} 3`, temp: 29, low: 24, condition: "Clear", icon: "01d" },
    { day: `${t("weather.day")} 4`, temp: 31, low: 26, condition: "Sunny", icon: "01d" },
    { day: `${t("weather.day")} 5`, temp: 28, low: 23, condition: "Rain", icon: "10d" },
    { day: `${t("weather.day")} 6`, temp: 29, low: 25, condition: "Clouds", icon: "03d" },
  ];
  const WeatherIcon = getWeatherIcon(displayWeather.icon);

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
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                placeholder={t("weather.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
            </div>
            <button onClick={fetchWeather} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          {error && <p className="text-destructive text-sm mb-4">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="md:col-span-3 bg-card border border-border rounded-2xl p-8 bg-gradient-to-br from-orange-50/50 to-transparent">
              <p className="text-sm text-primary font-medium mb-1">{t("weather.currentWeather")}</p>
              <div className="flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4 text-foreground" />
                <span className="font-bold text-foreground text-lg">{displayWeather.city}</span>
              </div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-6xl font-bold text-foreground">{displayWeather.temp}°</div>
                  <div className="text-foreground font-semibold mt-1">{displayWeather.condition}</div>
                  <div className="text-muted-foreground text-sm">{t("weather.feelsLike")} {displayWeather.feelsLike}°C</div>
                </div>
                <WeatherIcon className="w-16 h-16 text-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/60 rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t("weather.humidityLabel")}</div>
                  <div className="font-bold text-foreground">{displayWeather.humidity}%</div>
                </div>
                <div className="bg-muted/60 rounded-xl p-4 text-center">
                  <Wind className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">{t("weather.windLabel")}</div>
                  <div className="font-bold text-foreground">{displayWeather.wind} m/s</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-lg font-display">{t("weather.farmingAdvisory")}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{t("weather.advisorySubtitle")}</p>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{t("weather.favorableWeather")}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground font-display mb-1">{t("weather.fiveDayForecast")}</h2>
            <p className="text-muted-foreground text-sm mb-6">{t("weather.planAhead")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {displayForecast.map((day) => {
                const DayIcon = getWeatherIcon(day.icon);
                return (
                  <div key={day.day} className="bg-muted/50 rounded-xl p-5 text-center">
                    <div className="font-semibold text-foreground text-sm mb-3">{day.day}</div>
                    <DayIcon className="w-10 h-10 mx-auto mb-3 text-secondary" />
                    <div className="text-2xl font-bold text-foreground">{day.temp}°</div>
                    <div className="text-sm text-muted-foreground">{day.low}°</div>
                    <div className="text-xs text-muted-foreground mt-2">{day.condition}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Weather;
