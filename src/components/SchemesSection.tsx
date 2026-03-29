import { motion } from "framer-motion";

const schemes = [
  {
    name: "PM-KISAN",
    ministry: "Ministry of Agriculture",
    benefit: "₹6,000/year",
    description: "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families.",
    eligibility: "All farmer families with cultivable land",
    link: "#",
  },
  {
    name: "PM Fasal Bima Yojana",
    ministry: "Ministry of Agriculture",
    benefit: "Crop Insurance",
    description: "Comprehensive crop insurance scheme covering all food & oilseed crops and annual commercial/horticultural crops.",
    eligibility: "All farmers growing notified crops",
    link: "#",
  },
  {
    name: "Kisan Credit Card",
    ministry: "NABARD",
    benefit: "Low-interest Credit",
    description: "Provides farmers with affordable credit for crop production, post-harvest expenses, and farm maintenance.",
    eligibility: "All farmers, sharecroppers, tenant farmers",
    link: "#",
  },
  {
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture",
    benefit: "Free Soil Testing",
    description: "Free soil health cards with nutrient status and fertilizer recommendations for every farm.",
    eligibility: "All farmers across India",
    link: "#",
  },
  {
    name: "e-NAM",
    ministry: "Ministry of Agriculture",
    benefit: "Online Market Access",
    description: "Pan-India electronic trading portal connecting APMC mandis for transparent price discovery and better returns.",
    eligibility: "All farmers and traders",
    link: "#",
  },
  {
    name: "PM Krishi Sinchai Yojana",
    ministry: "Ministry of Water Resources",
    benefit: "Irrigation Support",
    description: "Provides support for micro-irrigation (drip & sprinkler) with subsidies up to 55-70% of the system cost.",
    eligibility: "All farmers with agricultural land",
    link: "#",
  },
];

const SchemesSection = () => (
  <section id="schemes" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="section-title">Government Schemes</h2>
        <p className="section-subtitle">
          Discover and apply for agricultural schemes and subsidies from state and central government
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme, i) => (
          <motion.div
            key={scheme.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="service-card flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-foreground">{scheme.name}</h3>
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                {scheme.benefit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{scheme.ministry}</p>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">{scheme.description}</p>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Eligibility:</span> {scheme.eligibility}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SchemesSection;
