import { useState } from "react";
import { Search, FileText, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const schemes = [
  { name: "PM-KISAN", desc: "Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to farmer families.", details: "Under this scheme, eligible farmer families receive ₹6,000 per year in three equal installments of ₹2,000 each. The amount is directly transferred to the bank accounts of the beneficiaries. All landholding farmer families are eligible for this scheme, subject to certain exclusion criteria." },
  { name: "Kisan Credit Card (KCC)", desc: "Provides affordable credit to farmers for agricultural and allied activities.", details: "KCC provides farmers with timely and adequate credit for their agricultural needs. The scheme covers crop production, post-harvest expenses, maintenance of farm assets, and consumption needs. Interest rate is subsidized at 4% per annum for timely repayment." },
  { name: "PM Fasal Bima Yojana", desc: "Comprehensive crop insurance scheme to protect farmers against crop failure due to natural calamities.", details: "Farmers pay a premium of 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops. The scheme covers yield losses, post-harvest losses, prevented sowing, and localized calamities." },
  { name: "Soil Health Card Scheme", desc: "Provides soil health cards to farmers with crop-wise nutrient recommendations.", details: "Every farmer gets a soil health card every 2 years, which contains information on the status of soil nutrients (N, P, K, S, Zn, Fe, Cu, Mn, B) and fertilizer recommendations for 6 crops." },
  { name: "e-NAM (National Agriculture Market)", desc: "Pan-India electronic trading portal linking APMCs across the country.", details: "e-NAM connects 1,000+ mandis across India on a single platform for transparent price discovery. Farmers can sell produce online to buyers across states, ensuring competitive prices and reducing intermediaries." },
  { name: "PM Kisan Maan Dhan Yojana", desc: "Pension scheme for small and marginal farmers above 60 years of age.", details: "Small and marginal farmers aged 18-40 can register. They receive ₹3,000 monthly pension after age 60. The central government matches the farmer's contribution to the pension fund." },
  { name: "Agricultural Infrastructure Fund", desc: "Financing facility for investment in post-harvest management and community farming assets.", details: "₹1 lakh crore fund for creating post-harvest infrastructure including cold stores, warehouses, processing units, and e-marketing platforms. Interest subvention of 3% per annum for loans up to ₹2 crore." },
  { name: "National Mission for Sustainable Agriculture", desc: "Promotes sustainable agriculture through climate change adaptation strategies.", details: "The mission focuses on rainfed agriculture, soil health management, water use efficiency, and climate change adaptation. It includes components like Rainfed Area Development, Soil Health Management, and Sub-Mission on Agroforestry." },
  { name: "Paramparagat Krishi Vikas Yojana", desc: "Promotes organic farming through cluster-based approach.", details: "Farmers are provided financial assistance of ₹50,000 per hectare for 3 years for organic farming. The scheme promotes participatory guarantee system (PGS) certification and supports marketing of organic produce." },
  { name: "Sub-Mission on Agricultural Mechanization", desc: "Promotes agricultural mechanization among small and marginal farmers.", details: "Subsidy of 40-50% on purchase of agricultural machinery. Includes establishment of Custom Hiring Centers, Farm Machinery Banks, and Hi-Tech Hubs for testing and training." },
  { name: "Rashtriya Krishi Vikas Yojana", desc: "Incentivizes states to increase public investment in agriculture.", details: "Provides flexible funding to states for innovative agriculture development projects. Focus areas include crop development, horticulture, mechanization, natural resource management, and marketing infrastructure." },
  { name: "PM Krishi Sinchai Yojana", desc: "Provides support for micro-irrigation and water management with subsidies up to 55-70%.", details: "Focuses on 'Per Drop More Crop' through micro-irrigation (drip & sprinkler). Subsidies range from 55% for general category to 70% for SC/ST and small farmers. Also includes watershed development and water body restoration." },
];

const Schemes = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = schemes.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">Government Schemes</h1>
          <p className="text-muted-foreground mb-8">Explore agricultural schemes and subsidies for farmers</p>

          {/* Stats */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Schemes Available</p>
              <p className="text-3xl font-bold text-primary">{schemes.length}</p>
            </div>
            <FileText className="w-10 h-10 text-muted-foreground/30" />
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 mb-8 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes..."
              className="bg-transparent outline-none text-foreground text-sm w-full"
            />
          </div>

          {/* Accordion list */}
          <div className="space-y-3">
            {filtered.map((scheme, i) => (
              <div key={scheme.name} className="bg-card border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-primary text-sm">{scheme.name}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{scheme.desc}</p>
                  </div>
                  {openIndex === i ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{scheme.details}</p>
                  </div>
                )}
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
