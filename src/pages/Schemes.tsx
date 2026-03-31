import { useState } from "react";
import { Search, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const schemes = [
  { name: "PM-KISAN", desc: "Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to farmer families.", details: "Under this scheme, eligible farmer families receive ₹6,000 per year in three equal installments of ₹2,000 each." },
  { name: "Kisan Credit Card (KCC)", desc: "Provides affordable credit to farmers for agricultural and allied activities.", details: "KCC provides farmers with timely and adequate credit. Interest rate is subsidized at 4% per annum for timely repayment." },
  { name: "PM Fasal Bima Yojana", desc: "Comprehensive crop insurance scheme to protect farmers against crop failure.", details: "Farmers pay a premium of 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial crops." },
  { name: "Soil Health Card Scheme", desc: "Provides soil health cards to farmers with crop-wise nutrient recommendations.", details: "Every farmer gets a soil health card every 2 years with nutrient status and fertilizer recommendations." },
  { name: "e-NAM", desc: "Pan-India electronic trading portal linking APMCs across the country.", details: "e-NAM connects 1,000+ mandis across India for transparent price discovery." },
  { name: "PM Kisan Maan Dhan Yojana", desc: "Pension scheme for small and marginal farmers above 60 years of age.", details: "Farmers receive ₹3,000 monthly pension after age 60." },
  { name: "Agricultural Infrastructure Fund", desc: "Financing facility for post-harvest management and community farming assets.", details: "₹1 lakh crore fund for post-harvest infrastructure. Interest subvention of 3% for loans up to ₹2 crore." },
  { name: "National Mission for Sustainable Agriculture", desc: "Promotes sustainable agriculture through climate change adaptation.", details: "Focuses on rainfed agriculture, soil health, and water use efficiency." },
  { name: "Paramparagat Krishi Vikas Yojana", desc: "Promotes organic farming through cluster-based approach.", details: "₹50,000 per hectare for 3 years for organic farming." },
  { name: "Sub-Mission on Agricultural Mechanization", desc: "Promotes agricultural mechanization among small farmers.", details: "Subsidy of 40-50% on purchase of agricultural machinery." },
  { name: "Rashtriya Krishi Vikas Yojana", desc: "Incentivizes states to increase public investment in agriculture.", details: "Flexible funding for innovative agriculture development projects." },
  { name: "PM Krishi Sinchai Yojana", desc: "Support for micro-irrigation and water management with subsidies up to 55-70%.", details: "Focuses on 'Per Drop More Crop' through micro-irrigation." },
];

const Schemes = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const filtered = schemes.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("schemes.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("schemes.subtitle")}</p>
          <div className="bg-card border border-border rounded-xl p-6 mb-8 flex items-center justify-between">
            <div><p className="text-sm text-muted-foreground">{t("schemes.totalSchemes")}</p><p className="text-3xl font-bold text-primary">{schemes.length}</p></div>
            <FileText className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 mb-8 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("schemes.searchPlaceholder")} className="bg-transparent outline-none text-foreground text-sm w-full" />
          </div>
          <div className="space-y-3">
            {filtered.map((scheme, i) => (
              <div key={scheme.name} className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors">
                  <div><h3 className="font-bold text-primary text-sm">{scheme.name}</h3><p className="text-muted-foreground text-sm mt-0.5">{scheme.desc}</p></div>
                  {openIndex === i ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                </button>
                {openIndex === i && <div className="px-5 pb-5 border-t border-border pt-4"><p className="text-sm text-muted-foreground leading-relaxed">{scheme.details}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Schemes;
