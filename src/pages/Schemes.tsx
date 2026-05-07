import { useState } from "react";
import { Search, FileText, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

const schemes = [
  { key: "pmKisan", name: "PM-KISAN", website: "https://pmkisan.gov.in" },
  { key: "kcc", name: "Kisan Credit Card (KCC)", website: "https://www.nabard.org/content.aspx?id=566" },
  { key: "pmfby", name: "PM Fasal Bima Yojana", website: "https://pmfby.gov.in" },
  { key: "soilHealth", name: "Soil Health Card Scheme", website: "https://soilhealth.dac.gov.in" },
  { key: "eNam", name: "e-NAM", website: "https://enam.gov.in" },
  { key: "pmKmd", name: "PM Kisan Maan Dhan Yojana", website: "https://maandhan.in" },
  { key: "aif", name: "Agricultural Infrastructure Fund", website: "https://agriinfra.dac.gov.in" },
  { key: "nmsa", name: "National Mission for Sustainable Agriculture", website: "https://nmsa.dac.gov.in" },
  { key: "pkvy", name: "Paramparagat Krishi Vikas Yojana", website: "https://pgsindia-ncof.gov.in/pkvy" },
  { key: "smam", name: "Sub-Mission on Agricultural Mechanization", website: "https://agrimachinery.nic.in" },
  { key: "rkvy", name: "Rashtriya Krishi Vikas Yojana", website: "https://rkvy.nic.in" },
  { key: "pmksy", name: "PM Krishi Sinchai Yojana", website: "https://pmksy.gov.in" },
];

const Schemes = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = schemes.filter((s) => {
    const name = t(`schemes.items.${s.key}.name`, s.name).toLowerCase();
    return name.includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-muted">
      
      <div className="py-8 pb-16">
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
              <div key={scheme.key} className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors">
                  <div>
                    <h3 className="font-bold text-primary text-sm">{t(`schemes.items.${scheme.key}.name`, scheme.name)}</h3>
                    <p className="text-muted-foreground text-sm mt-0.5">{t(`schemes.items.${scheme.key}.desc`)}</p>
                  </div>
                  {openIndex === i ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 border-t border-border pt-4 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`schemes.items.${scheme.key}.details`)}</p>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1"><span className="font-semibold text-foreground">{t("schemes.eligibility")}:</span> {t(`schemes.items.${scheme.key}.eligibility`)}</p>
                      <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{t("schemes.benefit")}:</span> {t(`schemes.items.${scheme.key}.benefit`)}</p>
                    </div>
                    <a href={scheme.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      <ExternalLink className="w-4 h-4" /> {t("schemes.visitWebsite")}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Schemes;
