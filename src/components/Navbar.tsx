import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, ArrowRight, Globe, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.weather"), to: "/weather" },
    { label: t("nav.marketPrices"), to: "/market-prices" },
    { label: t("nav.crops"), to: "/crops" },
    { label: t("nav.aiAssistant"), to: "/ai-assistant" },
    { label: t("nav.satellite"), to: "/satellite-health" },
    { label: t("nav.yieldPrediction"), to: "/yield-prediction" },
    { label: t("nav.community"), to: "/community" },
    { label: t("nav.learning"), to: "/learning" },
    { label: t("nav.schemes"), to: "/schemes" },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-primary-dark">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground font-display text-xl font-bold">
          <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
            <Leaf className="w-5 h-5 text-secondary-foreground" />
          </div>
          <span className="text-secondary">Crop</span>Wise
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={`text-sm font-medium transition-colors ${location.pathname === link.to ? "text-secondary" : "text-primary-foreground/80 hover:text-primary-foreground"}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors px-2 py-1 rounded-lg hover:bg-primary-foreground/10">
              <Globe className="w-4 h-4" />
              <span>{currentLang.native}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg py-2 min-w-[160px] z-50 max-h-[300px] overflow-y-auto">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); localStorage.setItem("i18nextLng", lang.code); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${i18n.language === lang.code ? "text-primary font-semibold bg-accent" : "text-foreground"}`}>
                    {lang.native} <span className="text-muted-foreground ml-1">({lang.label})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
                <span className="hidden xl:inline max-w-[100px] truncate">{profile?.display_name || user.email}</span>
              </div>
              <button onClick={async () => { await signOut(); navigate("/"); }} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors p-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                {t("nav.signIn")}
              </Link>
              <Link to="/login" className="bg-secondary text-secondary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                {t("nav.getStarted")}
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden bg-primary-dark overflow-hidden">
            <div className="flex flex-col gap-3 p-4">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={`font-medium text-sm ${location.pathname === link.to ? "text-secondary" : "text-primary-foreground"}`} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-primary-foreground/20 pt-3 mt-1">
                <p className="text-xs text-primary-foreground/50 mb-2">{t("nav.language")}</p>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); localStorage.setItem("i18nextLng", lang.code); }}
                      className={`text-xs px-2.5 py-1 rounded-full transition-colors ${i18n.language === lang.code ? "bg-secondary text-secondary-foreground" : "bg-primary-foreground/10 text-primary-foreground/80"}`}>
                      {lang.native}
                    </button>
                  ))}
                </div>
              </div>
              {user ? (
                <button onClick={async () => { await signOut(); setOpen(false); navigate("/"); }} className="btn-white text-sm mt-2 justify-center">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link to="/login" className="btn-white text-sm mt-2 justify-center" onClick={() => setOpen(false)}>
                  {t("nav.getStarted")} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
