import { useState } from "react";
import { CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, MapPin, Search, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const forecast = [
  { day: "Tomorrow", icon: Cloud, temp: 30, low: 25, condition: "Partly Cloudy" },
  { day: "Day 3", icon: Sun, temp: 29, low: 24, condition: "Clear Sky" },
  { day: "Day 4", icon: Sun, temp: 31, low: 26, condition: "Sunny" },
  { day: "Day 5", icon: CloudRain, temp: 28, low: 23, condition: "Light Rain" },
  { day: "Day 6", icon: Cloud, temp: 29, low: 25, condition: "Scattered Clouds" },
];

const Weather = () => {
  const [city, setCity] = useState("Kalol");

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">Weather Forecast</h1>
          <p className="text-muted-foreground mb-8">Get accurate weather data and farming advisories for your location</p>

          {/* Search */}
          <div className="flex gap-3 mb-8">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 flex-1 max-w-md">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city or location..."
                className="bg-transparent outline-none text-foreground text-sm w-full"
              />
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Current Weather + Advisory */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="md:col-span-3 bg-card border border-border rounded-2xl p-8 bg-gradient-to-br from-orange-50/50 to-transparent">
              <p className="text-sm text-primary font-medium mb-1">Current Weather</p>
              <div className="flex items-center gap-1 mb-4">
                <MapPin className="w-4 h-4 text-foreground" />
                <span className="font-bold text-foreground text-lg">{city}</span>
              </div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-6xl font-bold text-foreground">27°</div>
                  <div className="text-foreground font-semibold mt-1">Pleasant Weather</div>
                  <div className="text-muted-foreground text-sm">Feels like 29°C</div>
                </div>
                <Sun className="w-16 h-16 text-secondary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/60 rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">Humidity</div>
                  <div className="font-bold text-foreground">55%</div>
                </div>
                <div className="bg-muted/60 rounded-xl p-4 text-center">
                  <Wind className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                  <div className="text-sm text-muted-foreground">Wind</div>
                  <div className="font-bold text-foreground">3.5 m/s</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-lg font-display">Farming Advisory</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">Recommendations based on current weather</p>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">🌾 Weather conditions are favorable for farming activities.</span>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground font-display mb-1">5-Day Forecast</h2>
            <p className="text-muted-foreground text-sm mb-6">Plan your farming activities ahead</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {forecast.map((day) => (
                <div key={day.day} className="bg-muted/50 rounded-xl p-5 text-center">
                  <div className="font-semibold text-foreground text-sm mb-3">{day.day}</div>
                  <day.icon className="w-10 h-10 mx-auto mb-3 text-secondary" />
                  <div className="text-2xl font-bold text-foreground">{day.temp}°</div>
                  <div className="text-sm text-muted-foreground">{day.low}°</div>
                  <div className="text-xs text-muted-foreground mt-2">{day.condition}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Weather;
