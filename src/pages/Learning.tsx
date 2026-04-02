import { BookOpen, Video, FileText, Lightbulb, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Learning = () => {
  const { t } = useTranslation();

  const resources = [
    {
      icon: BookOpen,
      title: t("learning.cropGuides"),
      description: t("learning.cropGuidesDesc"),
      items: [
        { label: "Rice Cultivation Guide", url: "https://www.irri.org/rice-knowledge-bank" },
        { label: "Wheat Growing Manual", url: "https://iiwbr.icar.gov.in/" },
        { label: "Vegetable Farming Tips", url: "https://vikaspedia.in/agriculture/crop-production/package-of-practices/vegetables" },
        { label: "Organic Practices", url: "https://pgsindia-ncof.gov.in/organic_farming.aspx" },
      ],
    },
    {
      icon: Video,
      title: t("learning.videoTutorials"),
      description: t("learning.videoTutorialsDesc"),
      items: [
        { label: "Drip Irrigation Setup", url: "https://www.youtube.com/results?search_query=drip+irrigation+setup+india" },
        { label: "Pest Identification", url: "https://www.youtube.com/results?search_query=pest+identification+crops+india" },
        { label: "Soil Testing Methods", url: "https://www.youtube.com/results?search_query=soil+testing+methods+farming" },
        { label: "Composting Basics", url: "https://www.youtube.com/results?search_query=composting+basics+farming+india" },
      ],
    },
    {
      icon: FileText,
      title: t("learning.research"),
      description: t("learning.researchDesc"),
      items: [
        { label: "Crop Price Trends 2026", url: "https://agmarknet.gov.in/" },
        { label: "Climate Impact Report", url: "https://www.icar.org.in/" },
        { label: "Organic Market Analysis", url: "https://apeda.gov.in/apedawebsite/organic/organic.htm" },
        { label: "Subsidy Updates", url: "https://agricoop.nic.in/" },
      ],
    },
    {
      icon: Lightbulb,
      title: t("learning.innovations"),
      description: t("learning.innovationsDesc"),
      items: [
        { label: "Drone Spraying", url: "https://pib.gov.in/PressReleasePage.aspx?PRID=1884498" },
        { label: "IoT Soil Sensors", url: "https://www.nabard.org/" },
        { label: "AI Crop Diagnosis", url: "https://plantix.net/" },
        { label: "Vertical Farming", url: "https://www.youtube.com/results?search_query=vertical+farming+india" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("learning.title")}</h1>
          <p className="text-muted-foreground mb-10">{t("learning.subtitle")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <div key={res.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <res.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">{res.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{res.description}</p>
                    <ul className="space-y-2">
                      {res.items.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary flex items-center gap-2 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Learning;
