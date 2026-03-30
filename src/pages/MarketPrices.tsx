import { useState } from "react";
import { TrendingUp, TrendingDown, Search, MapPin, IndianRupee, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allPrices = [
  { crop: "Rice (Basmati)", market: "Delhi", price: "₹3,412/quintal", change: "2.5%", trend: "down" },
  { crop: "Rice (Non-Basmati)", market: "Kolkata", price: "₹2,157/quintal", change: "2.0%", trend: "down" },
  { crop: "Wheat", market: "Indore", price: "₹2,319/quintal", change: "+1.9%", trend: "up" },
  { crop: "Maize", market: "Nizamabad", price: "₹1,859/quintal", change: "0.6%", trend: "down" },
  { crop: "Cotton", market: "Rajkot", price: "₹6,504/quintal", change: "+0.1%", trend: "up" },
  { crop: "Soybean", market: "Indore", price: "₹4,236/quintal", change: "1.5%", trend: "down" },
  { crop: "Groundnut", market: "Rajkot", price: "₹5,744/quintal", change: "1.0%", trend: "down" },
  { crop: "Mustard", market: "Alwar", price: "₹5,074/quintal", change: "2.4%", trend: "down" },
  { crop: "Chana (Gram)", market: "Indore", price: "₹5,148/quintal", change: "+0.9%", trend: "up" },
  { crop: "Tur (Arhar)", market: "Latur", price: "₹7,256/quintal", change: "+0.8%", trend: "up" },
  { crop: "Urad", market: "Indore", price: "₹6,831/quintal", change: "+0.5%", trend: "up" },
  { crop: "Moong", market: "Jodhpur", price: "₹7,532/quintal", change: "+0.4%", trend: "up" },
  { crop: "Sugarcane", market: "UP", price: "₹308/quintal", change: "2.3%", trend: "down" },
  { crop: "Onion", market: "Nashik", price: "₹1,817/quintal", change: "+1.0%", trend: "up" },
  { crop: "Potato", market: "Agra", price: "₹1,195/quintal", change: "0.4%", trend: "down" },
  { crop: "Tomato", market: "Kolar", price: "₹2,510/quintal", change: "+0.4%", trend: "up" },
  { crop: "Chilli (Dry)", market: "Guntur", price: "₹14,778/quintal", change: "1.5%", trend: "down" },
  { crop: "Turmeric", market: "Nizamabad", price: "₹9,352/quintal", change: "1.6%", trend: "down" },
  { crop: "Ginger", market: "Cochin", price: "₹4,896/quintal", change: "+2.0%", trend: "up" },
  { crop: "Garlic", market: "Rajkot", price: "₹8,603/quintal", change: "+1.2%", trend: "up" },
];

const MarketPrices = () => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"market" | "msp">("market");

  const filtered = allPrices.filter(
    (p) => p.crop.toLowerCase().includes(search.toLowerCase()) || p.market.toLowerCase().includes(search.toLowerCase())
  );

  const pricesUp = allPrices.filter((p) => p.trend === "up").length;
  const pricesDown = allPrices.filter((p) => p.trend === "down").length;
  const avgPrice = Math.round(allPrices.reduce((a, p) => a + parseInt(p.price.replace(/[^\d]/g, "")), 0) / allPrices.length);

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">Market Prices</h1>
          <p className="text-muted-foreground mb-8">Real time mandi prices and MSP rates across India</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Markets", value: "20", icon: MapPin, color: "text-primary" },
              { label: "Avg Price", value: `₹${avgPrice}`, icon: IndianRupee, color: "text-primary" },
              { label: "Prices Up", value: String(pricesUp), icon: TrendingUp, color: "text-primary" },
              { label: "Prices Down", value: String(pricesDown), icon: TrendingDown, color: "text-destructive" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => setTab("market")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "market" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
              Market Prices
            </button>
            <button onClick={() => setTab("msp")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "msp" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
              MSP Rates
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 mb-6 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by crop or market..."
              className="bg-transparent outline-none text-foreground text-sm w-full"
            />
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-bold text-foreground text-lg">Current Prices</h2>
              <p className="text-sm text-muted-foreground">Showing {filtered.length} of {allPrices.length} records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Crop</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Market</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Price</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Change</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.crop} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary text-sm">{item.crop}</td>
                      <td className="px-6 py-4">
                        <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">{item.market}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground text-sm">{item.price}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${item.trend === "up" ? "text-primary" : "text-destructive"}`}>
                          {item.change}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.trend === "up" ? (
                          <TrendingUp className="w-4 h-4 text-primary" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketPrices;
