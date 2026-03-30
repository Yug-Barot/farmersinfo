import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import Crops from "./pages/Crops";
import Schemes from "./pages/Schemes";
import Community from "./pages/Community";
import Learning from "./pages/Learning";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/community" element={<Community />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
