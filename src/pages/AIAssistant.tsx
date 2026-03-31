import { useState } from "react";
import { Send, Bot, User, Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message { role: "user" | "assistant"; content: string; }

const suggestions = [
  "What crops should I grow in Kharif season?",
  "How to improve soil fertility naturally?",
  "Best pest control for tomato crops?",
  "How to apply for PM-KISAN scheme?",
];

const AIAssistant = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: t("ai.greeting") },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setTimeout(() => {
      const responses: Record<string, string> = {
        "kharif": "For Kharif season (June-October), the best crops include:\n\n🌾 **Rice** - Requires standing water\n🌽 **Maize** - Versatile crop\n🥜 **Groundnut** - Sandy loam soil\n🌿 **Cotton** - Warm climate\n🫘 **Soybean** - Fixes nitrogen\n\nChoose based on your soil type!",
        "soil": "To improve soil fertility:\n\n1. **Composting** - Farm waste, cow dung\n2. **Green manuring** - Dhaincha or sunhemp\n3. **Crop rotation** - Alternate legumes with cereals\n4. **Vermicomposting** - Earthworms for rich matter\n5. **Mulching** - Cover soil to retain moisture",
        "pest": "For tomato pest control:\n\n🐛 **Fruit borer** - Pheromone traps, neem oil\n🦗 **Whitefly** - Yellow sticky traps\n🍂 **Leaf curl** - Remove affected plants\n🦠 **Early blight** - Mancozeb spray\n\n**Organic:** Neem oil, garlic-chilli spray!",
        "pm-kisan": "To apply for **PM-KISAN**:\n\n1. Visit CSC or pmkisan.gov.in\n2. Documents: Aadhaar, bank details, land docs\n3. Benefits: ₹6,000/year in 3 installments\n\nCheck status on PM-KISAN portal.",
      };
      let reply = "That's a great question! I'd recommend consulting your local Krishi Vigyan Kendra (KVK) for region-specific advice.";
      const lower = msg.toLowerCase();
      if (lower.includes("kharif") || lower.includes("season")) reply = responses["kharif"];
      else if (lower.includes("soil") || lower.includes("fertility")) reply = responses["soil"];
      else if (lower.includes("pest") || lower.includes("tomato")) reply = responses["pest"];
      else if (lower.includes("pm-kisan") || lower.includes("scheme")) reply = responses["pm-kisan"];
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <Navbar />
      <div className="pt-20 pb-8 flex-1 flex flex-col">
        <div className="container mx-auto px-4 max-w-3xl flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Sprout className="w-5 h-5 text-primary-foreground" /></div>
            <div><h1 className="text-2xl font-bold text-foreground font-display">{t("ai.title")}</h1><p className="text-sm text-muted-foreground">{t("ai.subtitle")}</p></div>
          </div>
          <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[50vh]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-primary-foreground" /></div>}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}><div className="whitespace-pre-line">{msg.content}</div></div>
                  {msg.role === "user" && <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-secondary-foreground" /></div>}
                </div>
              ))}
            </div>
            {messages.length <= 1 && (
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (<button key={s} onClick={() => handleSend(s)} className="text-xs bg-muted border border-border rounded-full px-3 py-1.5 text-foreground hover:bg-accent transition-colors">{s}</button>))}
              </div>
            )}
            <div className="border-t border-border p-4 flex gap-3">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={t("ai.inputPlaceholder")} className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none" />
              <button onClick={() => handleSend()} className="bg-primary text-primary-foreground px-4 rounded-xl hover:opacity-90 transition-opacity"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AIAssistant;
