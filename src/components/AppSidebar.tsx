import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import {
  Home, Cloud, TrendingUp, Leaf, Bot, Satellite, BarChart3, Users, BookOpen, FileText, Bug, Settings, LogOut, Globe, User,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { languages } from "@/i18n";
import { useState } from "react";

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const [langOpen, setLangOpen] = useState(false);

  const mainLinks = [
    { label: t("nav.home"), to: "/", icon: Home },
    { label: t("nav.weather"), to: "/weather", icon: Cloud },
    { label: t("nav.marketPrices"), to: "/market-prices", icon: TrendingUp },
    { label: t("nav.crops"), to: "/crops", icon: Leaf },
    { label: t("nav.schemes"), to: "/schemes", icon: FileText },
  ];

  const toolLinks = [
    { label: t("nav.aiAssistant"), to: "/ai-assistant", icon: Bot },
    { label: t("nav.satellite"), to: "/satellite-health", icon: Satellite },
    { label: t("nav.yieldPrediction"), to: "/yield-prediction", icon: BarChart3 },
    { label: t("nav.diseaseDetection") || "Disease Detection", to: "/disease-detection", icon: Bug },
  ];

  const communityLinks = [
    { label: t("nav.community"), to: "/community", icon: Users },
    { label: t("nav.learning"), to: "/learning", icon: BookOpen },
  ];

  const isActive = (path: string) => pathname === path;

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center flex-shrink-0">
            <Leaf className="w-5 h-5 text-secondary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg font-bold">
              <span className="text-secondary">Crop</span><span className="text-foreground">Wise</span>
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton isActive={isActive(item.to)} onClick={() => navigate(item.to)} tooltip={item.label}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolLinks.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton isActive={isActive(item.to)} onClick={() => navigate(item.to)} tooltip={item.label}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityLinks.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton isActive={isActive(item.to)} onClick={() => navigate(item.to)} tooltip={item.label}>
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("nav.language")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLang.native}</span>
                </button>
                {langOpen && (
                  <div className="mt-1 flex flex-wrap gap-1 px-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); localStorage.setItem("i18nextLng", lang.code); setLangOpen(false); }}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${i18n.language === lang.code ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        {user ? (
          <div className="space-y-1">
            <SidebarMenuButton onClick={() => navigate("/account")} tooltip="Account" isActive={isActive("/account")}>
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              {!collapsed && <span className="truncate text-sm">{profile?.display_name || user.email}</span>}
            </SidebarMenuButton>
            <SidebarMenuButton onClick={async () => { await signOut(); navigate("/"); }} tooltip="Sign Out">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </div>
        ) : (
          <SidebarMenuButton onClick={() => navigate("/login")} tooltip="Sign In">
            <User className="h-4 w-4" />
            {!collapsed && <span>{t("nav.signIn")}</span>}
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
