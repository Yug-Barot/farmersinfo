import { useState } from "react";
import { Users, TrendingUp, MessageCircle, Heart, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Community = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"stories" | "discussions">("stories");

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div><h1 className="text-3xl font-bold text-foreground font-display mb-2">{t("community.title")}</h1><p className="text-muted-foreground">{t("community.subtitle")}</p></div>
            <div className="flex gap-3">
              <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"><Plus className="w-4 h-4" /> {t("community.shareStory")}</button>
              <button className="bg-card border border-border text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted transition-colors flex items-center gap-2"><Search className="w-4 h-4" /> {t("community.startDiscussion")}</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: t("community.totalPosts"), value: "0", color: "text-primary" },
              { icon: TrendingUp, label: t("community.successStories"), value: "0", color: "text-primary" },
              { icon: MessageCircle, label: t("community.discussions"), value: "0", color: "text-primary" },
              { icon: Heart, label: t("community.totalLikes"), value: "0", color: "text-destructive" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-5"><div className="flex items-center gap-3"><s.icon className={`w-6 h-6 ${s.color}`} /><div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div></div></div>
            ))}
          </div>
          <div className="flex gap-2 mb-8">
            <button onClick={() => setTab("stories")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "stories" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>{t("community.successStories")}</button>
            <button onClick={() => setTab("discussions")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "discussions" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>{t("community.discussions")}</button>
          </div>
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("community.emptyState")}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
