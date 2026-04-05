import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
                <Leaf className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-secondary">Crop</span>Wise
            </Link>
            <p className="text-background/50 text-sm leading-relaxed mb-4">{t("footer.description")}</p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                  <Icon className="w-4 h-4 text-background/60" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2.5 text-sm text-background/50">
              {[
                { label: t("footer.liveWeather"), to: "/weather" },
                { label: t("nav.marketPrices"), to: "/market-prices" },
                { label: t("footer.cropDatabase"), to: "/crops" },
                { label: t("footer.aiFarmAssistant"), to: "/ai-assistant" },
                { label: t("footer.communityHub"), to: "/community" },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="hover:text-secondary transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-2.5 text-sm text-background/50">
              {[
                { label: t("footer.govSchemes"), to: "/schemes" },
                { label: t("footer.learningHub"), to: "/learning" },
                { label: t("footer.cropFinder"), to: "/crops" },
                { label: t("nav.aiAssistant"), to: "/ai-assistant" },
                { label: t("nav.community"), to: "/community" },
              ].map((s) => (
                <li key={s.label}><Link to={s.to} className="hover:text-secondary transition-colors">{s.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">{t("footer.contactUs")}</h4>
            <ul className="space-y-3 text-sm text-background/50">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" /> Ganpat University</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" /> 9558053175</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary" /> dhruvatishpandya@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/30">© {new Date().getFullYear()} CropWise. {t("footer.allRightsReserved")}</p>
          <div className="flex gap-6 text-sm text-background/30">
            <a href="#" className="hover:text-background/60 transition-colors">{t("footer.privacyPolicy")}</a>
            <a href="#" className="hover:text-background/60 transition-colors">{t("footer.termsOfService")}</a>
            <a href="#" className="hover:text-background/60 transition-colors">{t("footer.about")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
