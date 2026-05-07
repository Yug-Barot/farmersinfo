import { useState, useEffect } from "react";
import { BarChart3, Sprout, Droplets, Thermometer, MapPin, TrendingUp, Loader2, Calculator, History, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PredictionResult {
  crop: string;
  predictedYield: number;
  unit: string;
  confidence: number;
  factors: { label: string; impact: string; color: string }[];
  recommendation: string;
  mspPrice: number;
  estimatedRevenue: number;
}

interface SavedPrediction {
  id: string;
  crop: string;
  area: number;
  soil_type: string;
  state: string;
  rainfall: number;
  predicted_yield: number;
  confidence: number;
  msp_price: number;
  estimated_revenue: number;
  recommendation: string | null;
  created_at: string;
}

const cropOptions = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Groundnut", "Mustard", "Potato", "Tomato", "Onion", "Chilli", "Turmeric", "Banana", "Mango"];
const soilTypes = ["Alluvial", "Black (Regur)", "Red", "Laterite", "Sandy", "Clay", "Loamy"];
const stateOptions = ["Gujarat", "Maharashtra", "Punjab", "Haryana", "UP", "MP", "Rajasthan", "Karnataka", "Tamil Nadu", "AP", "Telangana", "West Bengal", "Bihar", "Odisha", "Kerala"];

const generatePrediction = (crop: string, area: number, soil: string, state: string, rainfall: number): PredictionResult => {
  const baseYields: Record<string, number> = { Rice: 25, Wheat: 22, Maize: 28, Cotton: 8, Sugarcane: 700, Soybean: 12, Groundnut: 15, Mustard: 10, Potato: 200, Tomato: 250, Onion: 180, Chilli: 15, Turmeric: 50, Banana: 400, Mango: 80 };
  const mspPrices: Record<string, number> = { Rice: 2320, Wheat: 2275, Maize: 2090, Cotton: 7020, Sugarcane: 315, Soybean: 4892, Groundnut: 6377, Mustard: 5650, Potato: 1200, Tomato: 2500, Onion: 1800, Chilli: 14000, Turmeric: 9000, Banana: 3500, Mango: 5000 };
  const base = baseYields[crop] || 20;
  const soilFactor = soil === "Alluvial" || soil === "Loamy" ? 1.15 : soil === "Black (Regur)" ? 1.1 : soil === "Sandy" ? 0.8 : 1.0;
  const rainFactor = rainfall > 1200 ? 1.1 : rainfall > 800 ? 1.05 : rainfall > 400 ? 1.0 : 0.85;
  const predicted = Math.round(base * soilFactor * rainFactor * (0.9 + Math.random() * 0.2) * 10) / 10;
  const msp = mspPrices[crop] || 2000;
  return {
    crop, predictedYield: predicted, unit: "quintals/hectare",
    confidence: Math.round(75 + Math.random() * 20),
    factors: [
      { label: "Soil Quality", impact: soilFactor >= 1.1 ? "Positive" : soilFactor < 1.0 ? "Negative" : "Neutral", color: soilFactor >= 1.1 ? "text-green-600" : soilFactor < 1.0 ? "text-red-500" : "text-yellow-500" },
      { label: "Rainfall", impact: rainFactor >= 1.05 ? "Positive" : rainFactor < 1.0 ? "Negative" : "Neutral", color: rainFactor >= 1.05 ? "text-green-600" : rainFactor < 1.0 ? "text-red-500" : "text-yellow-500" },
      { label: "Region Suitability", impact: "Positive", color: "text-green-600" },
    ],
    recommendation: predicted > base ? `Expected yield is above average for ${crop}. Consider expanding cultivation area.` : `Expected yield is below average. Consider soil treatment and improved seed varieties.`,
    mspPrice: msp,
    estimatedRevenue: Math.round(predicted * area * msp),
  };
};

const YieldPrediction = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [soil, setSoil] = useState("");
  const [state, setState] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<SavedPrediction[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase.from("yield_predictions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
    if (data) setHistory(data as SavedPrediction[]);
  };

  const handlePredict = async () => {
    if (!crop || !area || !soil || !state || !rainfall) return;
    setLoading(true);
    setTimeout(async () => {
      const prediction = generatePrediction(crop, parseFloat(area), soil, state, parseFloat(rainfall));
      setResult(prediction);
      setLoading(false);
      // Save to DB
      if (user) {
        await supabase.from("yield_predictions").insert({
          user_id: user.id, crop, area: parseFloat(area), soil_type: soil, state,
          rainfall: parseFloat(rainfall), predicted_yield: prediction.predictedYield,
          confidence: prediction.confidence, msp_price: prediction.mspPrice,
          estimated_revenue: prediction.estimatedRevenue, recommendation: prediction.recommendation,
        });
        loadHistory();
      }
    }, 1500);
  };

  const deletePrediction = async (id: string) => {
    await supabase.from("yield_predictions").delete().eq("id", id);
    setHistory(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-muted">
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground font-display">{t("yield.title")}</h1>
            </div>
            {user && (
              <button onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showHistory ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
                <History className="w-4 h-4" /> {t("yield.history") || "History"} {history.length > 0 && `(${history.length})`}
              </button>
            )}
          </div>
          <p className="text-muted-foreground mb-8">{t("yield.subtitle")}</p>

          {showHistory ? (
            <div className="space-y-3 mb-8">
              <h2 className="text-lg font-bold text-foreground font-display">{t("yield.predictionHistory") || "Prediction History"}</h2>
              {history.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("yield.noHistory") || "No predictions yet. Make your first prediction!"}</p>
                </div>
              ) : (
                history.map(p => (
                  <div key={p.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{p.crop}</h3>
                        <p className="text-xs text-muted-foreground">{p.state} • {p.soil_type} • {p.area} ha • {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}</p>
                      </div>
                      <button onClick={() => deletePrediction(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                      <div><p className="text-xs text-muted-foreground">{t("yield.predictedYield")}</p><p className="text-lg font-bold text-primary">{p.predicted_yield} q/ha</p></div>
                      <div><p className="text-xs text-muted-foreground">{t("yield.confidence")}</p><p className="text-lg font-bold text-green-600">{p.confidence}%</p></div>
                      <div><p className="text-xs text-muted-foreground">{t("yield.estimatedRevenue")}</p><p className="text-lg font-bold text-secondary">₹{p.estimated_revenue.toLocaleString()}</p></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Input Form */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                <h2 className="text-lg font-bold text-foreground font-display mb-6">{t("yield.enterDetails")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("yield.selectCrop")}</label>
                    <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none">
                      <option value="">{t("yield.chooseCrop")}</option>
                      {cropOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("yield.landArea")}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-4 py-3">
                      <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder={t("yield.enterArea")} className="bg-transparent outline-none text-foreground text-sm w-full" />
                      <span className="text-xs text-muted-foreground">{t("yield.hectares")}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("yield.soilType")}</label>
                    <select value={soil} onChange={e => setSoil(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none">
                      <option value="">{t("yield.chooseSoil")}</option>
                      {soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("yield.state")}</label>
                    <select value={state} onChange={e => setState(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground outline-none">
                      <option value="">{t("yield.chooseState")}</option>
                      {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t("yield.annualRainfall")}</label>
                    <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-4 py-3">
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                      <input type="number" value={rainfall} onChange={e => setRainfall(e.target.value)} placeholder={t("yield.enterRainfall")} className="bg-transparent outline-none text-foreground text-sm w-full" />
                      <span className="text-xs text-muted-foreground">mm</span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button onClick={handlePredict} disabled={loading || !crop || !area || !soil || !state || !rainfall}
                      className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                      {t("yield.predict")}
                    </button>
                  </div>
                </div>
              </div>

              {result && (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-foreground font-display mb-6">{t("yield.predictionResult")}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                        <Sprout className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">{t("yield.predictedYield")}</p>
                        <p className="text-2xl font-bold text-primary">{result.predictedYield}</p>
                        <p className="text-xs text-muted-foreground">{result.unit}</p>
                      </div>
                      <div className="bg-muted rounded-xl p-5 text-center">
                        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">{t("yield.confidence")}</p>
                        <p className="text-2xl font-bold text-green-600">{result.confidence}%</p>
                      </div>
                      <div className="bg-muted rounded-xl p-5 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t("yield.mspRate")}</p>
                        <p className="text-2xl font-bold text-foreground">₹{result.mspPrice.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">/quintal</p>
                      </div>
                      <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-5 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{t("yield.estimatedRevenue")}</p>
                        <p className="text-2xl font-bold text-secondary">₹{result.estimatedRevenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{t("yield.forArea", { area })}</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-3">{t("yield.impactFactors")}</h3>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {result.factors.map(f => (
                        <div key={f.label} className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
                          <span className="text-sm text-foreground">{f.label}</span>
                          <span className={`text-sm font-semibold ${f.color}`}>{f.impact}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <h4 className="font-semibold text-foreground mb-2">{t("yield.recommendation")}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-foreground font-display mb-4">{t("yield.tipsTitle")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: Thermometer, title: t("yield.tipSoil"), desc: t("yield.tipSoilDesc") },
                        { icon: Droplets, title: t("yield.tipIrrigation"), desc: t("yield.tipIrrigationDesc") },
                        { icon: Sprout, title: t("yield.tipSeed"), desc: t("yield.tipSeedDesc") },
                        { icon: MapPin, title: t("yield.tipSeason"), desc: t("yield.tipSeasonDesc") },
                      ].map(tip => (
                        <div key={tip.title} className="flex items-start gap-3 bg-muted rounded-xl p-4">
                          <tip.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default YieldPrediction;
