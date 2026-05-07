import { useState } from "react";
import { Search, Thermometer, Droplets, MapPin, Calendar, Sprout, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const crops = [
  { key: "rice", name: "Rice", season: "Kharif", emoji: "🌾", temp: "20-35°C", water: "100-200",
    soil: "Clay, Loamy", states: "West Bengal, UP, Punjab, Andhra Pradesh, Tamil Nadu",
    sowingTime: "June-July", harvestTime: "October-November",
    msp: "₹2,300/qtl", yield: "25-40 qtl/ha",
    tips: "Transplant 21-25 day old seedlings. Maintain 5cm water level. Apply urea in 3 splits. Watch for blast and brown planthopper.",
    varieties: "Pusa Basmati 1121, Swarna, IR-64, Samba Mahsuri, MTU 7029" },
  { key: "wheat", name: "Wheat", season: "Rabi", emoji: "🌾", temp: "12-25°C", water: "50-100",
    soil: "Loamy, Clay loam", states: "UP, Punjab, Haryana, MP, Rajasthan",
    sowingTime: "October-November", harvestTime: "March-April",
    msp: "₹2,275/qtl", yield: "30-50 qtl/ha",
    tips: "Seed rate 100 kg/ha. First irrigation at crown root stage (21 days). Apply 120 kg N/ha. Monitor for rust diseases.",
    varieties: "HD-3226, WH-1105, PBW-725, DBW-187, GW-322" },
  { key: "cotton", name: "Cotton", season: "Kharif", emoji: "🌿", temp: "21-30°C", water: "60-100",
    soil: "Black cotton soil, Alluvial", states: "Gujarat, Maharashtra, Telangana, Haryana, Rajasthan",
    sowingTime: "April-May", harvestTime: "October-January",
    msp: "₹6,620/qtl", yield: "15-25 qtl/ha",
    tips: "Maintain 60-90 cm spacing. Use Bt cotton for bollworm resistance. Apply potash for fiber quality. Pick at proper maturity.",
    varieties: "Bt Cotton hybrids, Suraj, Anjali, MCU-5, DCH-32" },
  { key: "sugarcane", name: "Sugarcane", season: "Throughout", emoji: "🎋", temp: "21-27°C", water: "100-150",
    soil: "Deep loamy, Well-drained", states: "UP, Maharashtra, Karnataka, Tamil Nadu, Gujarat",
    sowingTime: "October-March", harvestTime: "After 10-12 months",
    msp: "₹315/qtl (FRP)", yield: "700-1000 qtl/ha",
    tips: "Use 3-budded setts. Earthing up at 120 days. Trash mulching conserves moisture. Watch for red rot and top borer.",
    varieties: "Co 0238, CoLk 94184, Co 86032, CoC 671, CoS 767" },
  { key: "maize", name: "Maize", season: "Kharif", emoji: "🌽", temp: "21-27°C", water: "50-100",
    soil: "Sandy loam, Loamy", states: "Karnataka, MP, Bihar, Rajasthan, Maharashtra",
    sowingTime: "June-July", harvestTime: "September-October",
    msp: "₹2,090/qtl", yield: "40-60 qtl/ha",
    tips: "Seed rate 20 kg/ha. Thinning at 15 days. Critical irrigation at tasseling. Apply zinc sulfate 25 kg/ha.",
    varieties: "DHM-117, HQPM-1, Vivek QPM-9, Bio 9681, Pioneer 30V92" },
  { key: "groundnut", name: "Groundnut", season: "Kharif", emoji: "🥜", temp: "20-30°C", water: "50-75",
    soil: "Sandy loam, Red soil", states: "Gujarat, Rajasthan, AP, Tamil Nadu, Karnataka",
    sowingTime: "June-July", harvestTime: "October-November",
    msp: "₹6,377/qtl", yield: "15-25 qtl/ha",
    tips: "Apply gypsum 500 kg/ha at flowering. Use Rhizobium seed treatment. Harvest at 70% pod maturity. Dry to 8% moisture.",
    varieties: "TG-37A, GG-20, ICGV-91114, TMV-2, K-6" },
  { key: "soybean", name: "Soybean", season: "Kharif", emoji: "🫘", temp: "20-30°C", water: "60-100",
    soil: "Black soil, Loamy", states: "MP, Maharashtra, Rajasthan, Karnataka",
    sowingTime: "June-July", harvestTime: "October-November",
    msp: "₹4,600/qtl", yield: "15-25 qtl/ha",
    tips: "Seed rate 75 kg/ha. Inoculate with Bradyrhizobium. Avoid waterlogging. Apply 20:80:20 NPK.",
    varieties: "JS-9560, JS-2034, NRC-37, MACS-1188, RVS 2001-4" },
  { key: "mustard", name: "Mustard", season: "Rabi", emoji: "🌼", temp: "10-25°C", water: "25-40",
    soil: "Sandy loam, Loamy", states: "Rajasthan, MP, UP, Haryana, Gujarat",
    sowingTime: "October-November", harvestTime: "February-March",
    msp: "₹5,650/qtl", yield: "12-18 qtl/ha",
    tips: "Thin to 15cm spacing at 15 DAS. First irrigation at 30 days. Apply sulfur 40 kg/ha. Watch for aphids.",
    varieties: "Pusa Mustard-28, RH-725, NRCHB-101, Bio-902, Varuna" },
  { key: "potato", name: "Potato", season: "Rabi", emoji: "🥔", temp: "15-25°C", water: "50-75",
    soil: "Sandy loam, Well-drained", states: "UP, West Bengal, Bihar, Gujarat, MP",
    sowingTime: "October-November", harvestTime: "January-March",
    msp: "—", yield: "200-300 qtl/ha",
    tips: "Use certified seed tubers. Ridge planting recommended. Irrigate at 7-10 day intervals. Apply earthing up at 30 & 45 days.",
    varieties: "Kufri Jyoti, Kufri Pukhraj, Kufri Bahar, Kufri Chipsona-3, Kufri Sindhuri" },
  { key: "tomato", name: "Tomato", season: "Throughout", emoji: "🍅", temp: "20-27°C", water: "40-60",
    soil: "Well-drained loamy", states: "MP, Karnataka, AP, Odisha, Gujarat",
    sowingTime: "Year-round", harvestTime: "60-90 days after transplant",
    msp: "—", yield: "250-400 qtl/ha",
    tips: "Stake plants for support. Mulch to retain moisture. Apply calcium to prevent blossom end rot. Harvest at breaker stage for market.",
    varieties: "Pusa Ruby, Arka Rakshak, Arka Samrat, NS-501, TO-1057" },
  { key: "onion", name: "Onion", season: "Rabi", emoji: "🧅", temp: "13-24°C", water: "50-75",
    soil: "Loamy, Alluvial", states: "Maharashtra, Karnataka, MP, Gujarat, Rajasthan",
    sowingTime: "November-December", harvestTime: "April-May",
    msp: "—", yield: "200-300 qtl/ha",
    tips: "Transplant 6-8 week old seedlings. Stop irrigation 10 days before harvest. Cure bulbs for 3-5 days. Store in well-ventilated sheds.",
    varieties: "N-53, Agrifound Dark Red, NHRDF Red, Bhima Super, Arka Niketan" },
  { key: "chilli", name: "Chilli", season: "Kharif", emoji: "🌶️", temp: "20-30°C", water: "60-125",
    soil: "Loamy, Black soil", states: "AP, Karnataka, Maharashtra, MP, Rajasthan",
    sowingTime: "June-July", harvestTime: "October onwards",
    msp: "—", yield: "15-25 qtl/ha (dry)",
    tips: "Space 60x45 cm. Apply micronutrients. Watch for thrips and mites. Dry to 10% moisture for storage.",
    varieties: "Byadgi, Guntur Sannam, Pusa Jwala, Arka Lohit, LCA-334" },
  { key: "turmeric", name: "Turmeric", season: "May-June", emoji: "🟡", temp: "20-30°C", water: "100-200",
    soil: "Loamy, Red soil", states: "Telangana, AP, Tamil Nadu, Odisha, Maharashtra",
    sowingTime: "May-June", harvestTime: "January-March (8-9 months)",
    msp: "—", yield: "200-250 qtl/ha (fresh)",
    tips: "Plant mother rhizomes. Apply mulch after planting. Earthing up at 60 & 120 days. Boil and dry cured turmeric for 10-15 days.",
    varieties: "Lakadong, Salem, Erode, Alleppey, Rajapore" },
  { key: "banana", name: "Banana", season: "Throughout", emoji: "🍌", temp: "20-35°C", water: "100-200",
    soil: "Rich loamy, Alluvial", states: "Tamil Nadu, Maharashtra, Gujarat, AP, Karnataka",
    sowingTime: "Year-round (tissue culture)", harvestTime: "12-14 months",
    msp: "—", yield: "300-500 qtl/ha",
    tips: "Use tissue culture plants. Desuckering essential. Apply potash for fruit quality. Prop heavy bunches. Watch for Panama wilt.",
    varieties: "Grand Naine, Robusta, Dwarf Cavendish, Poovan, Rasthali" },
  { key: "mango", name: "Mango", season: "Summer", emoji: "🥭", temp: "24-30°C", water: "75-250",
    soil: "Deep alluvial, Laterite", states: "UP, AP, Karnataka, Bihar, Gujarat",
    sowingTime: "July-August (planting)", harvestTime: "April-July",
    msp: "—", yield: "80-100 qtl/ha",
    tips: "Prune annually after harvest. Apply paclobutrazol for regular bearing. Spray borax during flowering. Bag fruits to prevent fly damage.",
    varieties: "Alphonso, Dasheri, Langra, Kesar, Banganapalli, Totapuri" },
  { key: "tea", name: "Tea", season: "Throughout", emoji: "🍵", temp: "20-30°C", water: "150-300",
    soil: "Acidic (pH 4.5-5.5), Well-drained", states: "Assam, West Bengal, Tamil Nadu, Kerala, Tripura",
    sowingTime: "Year-round (vegetative)", harvestTime: "Year-round (flushes)",
    msp: "—", yield: "15-20 qtl/ha (made tea)",
    tips: "Prune to table frame every 3-5 years. Pluck two leaves and a bud. Apply shade trees. Maintain soil acidity with sulfur.",
    varieties: "TV-1, TV-26, UPASI-9, Assam hybrid, Darjeeling China" },
  { key: "coffee", name: "Coffee", season: "Throughout", emoji: "☕", temp: "15-28°C", water: "150-250",
    soil: "Red laterite, Rich in organic matter", states: "Karnataka, Kerala, Tamil Nadu",
    sowingTime: "May-June (planting)", harvestTime: "November-February",
    msp: "—", yield: "10-15 qtl/ha",
    tips: "Grow under shade (Silver Oak, Dadap). Arabica at higher altitudes, Robusta at lower. Apply organic manure. Watch for white stem borer.",
    varieties: "Selection-795, Cauvery, CxR, Robusta-S.274, Chandragiri" },
  { key: "coconut", name: "Coconut", season: "Throughout", emoji: "🥥", temp: "27-32°C", water: "100-300",
    soil: "Laterite, Sandy loam, Alluvial", states: "Kerala, Karnataka, Tamil Nadu, AP, Goa",
    sowingTime: "June-September", harvestTime: "Year-round (after 5-6 years)",
    msp: "—", yield: "80-100 nuts/palm/year",
    tips: "Space 7.5m x 7.5m. Apply husk burial in basin. Apply 500g N per palm. Intercrop with cocoa, pepper. Watch for rhinoceros beetle.",
    varieties: "West Coast Tall, Chowghat Orange Dwarf, T x D hybrids, Kalpa Raksha" },
  { key: "jute", name: "Jute", season: "Kharif", emoji: "🌿", temp: "24-35°C", water: "150-200",
    soil: "Alluvial, Loamy", states: "West Bengal, Bihar, Assam, Odisha",
    sowingTime: "March-May", harvestTime: "July-September",
    msp: "₹5,050/qtl", yield: "25-30 qtl/ha",
    tips: "Broadcast or line sow at 6-8 kg/ha. Thin at 15 days. Harvest at small pod stage. Ret in clean, slow-flowing water for 15-20 days.",
    varieties: "JRO-524, JRO-8432, JRC-321, Navin, Shyamali" },
  { key: "chana", name: "Pulses (Chana)", season: "Rabi", emoji: "🫘", temp: "20-25°C", water: "40-50",
    soil: "Loamy, Clay loam", states: "MP, Rajasthan, Maharashtra, UP, Karnataka",
    sowingTime: "October-November", harvestTime: "February-March",
    msp: "₹5,440/qtl", yield: "12-20 qtl/ha",
    tips: "Seed treatment with Rhizobium + Trichoderma. Apply 20 kg N + 40 kg P2O5/ha. One irrigation at flowering. Watch for pod borer.",
    varieties: "Pusa 256, JG-11, JAKI-9218, GNG-1581, Virat" },
];

const seasonKeys = ["allSeasons", "kharif", "rabi", "summer", "throughout"];
const seasonMap: Record<string, string> = { allSeasons: "All Seasons", kharif: "Kharif", rabi: "Rabi", summer: "Summer", throughout: "Throughout" };

const Crops = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState("allSeasons");
  const [expandedCrop, setExpandedCrop] = useState<string | null>(null);

  const filtered = crops.filter((c) => {
    const translatedName = t(`crops.items.${c.key}.name`, c.name);
    const matchSearch = translatedName.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase());
    const matchSeason = season === "allSeasons" || c.season.toLowerCase().includes(seasonMap[season].toLowerCase());
    return matchSearch && matchSeason;
  });

  return (
    <div className="min-h-screen bg-muted">
      <div className="py-8 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("crops.title")}</h1>
          <p className="text-primary mb-8">{t("crops.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("crops.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {seasonKeys.map((s) => (
                <button key={s} onClick={() => setSeason(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${season === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground hover:bg-muted"}`}>
                  {t(`crops.seasons.${s}`, seasonMap[s])}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((crop) => {
              const isExpanded = expandedCrop === crop.key;
              return (
                <div key={crop.key} className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{crop.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg">{t(`crops.items.${crop.key}.name`, crop.name)}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${crop.season === "Kharif" ? "bg-primary/10 text-primary" : crop.season === "Rabi" ? "bg-blue-50 text-blue-600" : crop.season === "Summer" ? "bg-orange-50 text-orange-600" : "bg-muted text-muted-foreground"}`}>
                        {t(`crops.seasons.${crop.season.toLowerCase()}`, crop.season)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-destructive" /> {crop.temp}</span>
                    <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> {crop.water} mm</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Sow: {crop.sowingTime}</span>
                    <span className="flex items-center gap-1"><Sprout className="w-3.5 h-3.5 text-primary" /> {crop.yield}</span>
                  </div>

                  {crop.msp !== "—" && (
                    <div className="flex items-center gap-1 text-xs mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span className="font-semibold text-primary">MSP: {crop.msp}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{crop.states}</span>
                  </div>

                  <button
                    onClick={() => setExpandedCrop(isExpanded ? null : crop.key)}
                    className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    {isExpanded ? "Less Info" : "More Info"}
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2 text-xs text-muted-foreground animate-in fade-in-0 slide-in-from-top-2">
                      <p><strong className="text-foreground">Soil:</strong> {crop.soil}</p>
                      <p><strong className="text-foreground">Harvest:</strong> {crop.harvestTime}</p>
                      <p><strong className="text-foreground">Varieties:</strong> {crop.varieties}</p>
                      <p><strong className="text-foreground">Tips:</strong> {crop.tips}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crops;
