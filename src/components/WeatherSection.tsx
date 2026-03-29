import { motion } from "framer-motion";
import { CloudSun, CloudRain, Sun, Cloud, Thermometer, Wind, Droplets, Eye } from "lucide-react";

const forecast = [
  { day: "Today", icon: Sun, temp: "32°C", condition: "Sunny", rain: "0%", wind: "12 km/h" },
  { day: "Tomorrow", icon: CloudSun, temp: "30°C", condition: "Partly Cloudy", rain: "10%", wind: "15 km/h" },
  { day: "Wednesday", icon: Cloud, temp: "28°C", condition: "Cloudy", rain: "30%", wind: "18 km/h" },
  { day: "Thursday", icon: CloudRain, temp: "26°C", condition: "Light Rain", rain: "70%", wind: "22 km/h" },
  { day: "Friday", icon: CloudRain, temp: "25°C", condition: "Rainy", rain: "85%", wind: "25 km/h" },
  { day: "Saturday", icon: CloudSun, temp: "29°C", condition: "Clearing", rain: "20%", wind: "14 km/h" },
  { day: "Sunday", icon: Sun, temp: "31°C", condition: "Sunny", rain: "5%", wind: "10 km/h" },
];

const WeatherSection = () => (
  <section id="weather" className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="section-title">7-Day Weather Forecast</h2>
        <p className="section-subtitle">
          Plan your farming activities with accurate weather predictions for your region
        </p>
      </motion.div>

      {/* Current weather highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="gradient-hero rounded-2xl p-8 mb-8 text-primary-foreground"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Sun className="w-16 h-16 text-secondary" />
            <div>
              <div className="text-5xl font-bold">32°C</div>
              <div className="text-primary-foreground/70 text-lg">New Delhi, India</div>
              <div className="text-primary-foreground/60 text-sm">Sunny • Feels like 35°C</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Droplets, label: "Humidity", value: "65%" },
              { icon: Wind, label: "Wind", value: "12 km/h" },
              { icon: Thermometer, label: "Pressure", value: "1013 hPa" },
              { icon: Eye, label: "Visibility", value: "10 km" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <item.icon className="w-5 h-5 mx-auto mb-1 text-primary-foreground/60" />
                <div className="text-sm font-semibold">{item.value}</div>
                <div className="text-xs text-primary-foreground/50">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 7-day forecast */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecast.map((day, i) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`bg-card rounded-xl p-4 text-center border border-border hover:shadow-card-hover transition-all ${
              i === 0 ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="text-sm font-semibold text-foreground mb-2">{day.day}</div>
            <day.icon className={`w-8 h-8 mx-auto mb-2 ${i === 0 ? "text-secondary" : "text-muted-foreground"}`} />
            <div className="text-lg font-bold text-foreground">{day.temp}</div>
            <div className="text-xs text-muted-foreground mt-1">{day.condition}</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-muted-foreground">{day.rain}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Farming advisory */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 bg-card rounded-xl p-6 border border-primary/20"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-3">🌾 Farming Advisory</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
            Rain expected Thursday-Friday. Complete pesticide spraying before Wednesday.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
            Good conditions for wheat sowing this weekend after rain clears.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
            Humidity levels suitable for mushroom cultivation throughout the week.
          </li>
        </ul>
      </motion.div>
    </div>
  </section>
);

export default WeatherSection;
