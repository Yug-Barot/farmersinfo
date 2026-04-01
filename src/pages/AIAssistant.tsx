import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sprout, Plus, Trash2, Edit3, Mic, MicOff, Loader2, Menu, X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { streamChat, type Msg } from "@/lib/streamChat";
import { useToast } from "@/hooks/use-toast";

const langMap: Record<string, string> = {
  en: "en-US", hi: "hi-IN", gu: "gu-IN", ta: "ta-IN", te: "te-IN",
  mr: "mr-IN", bn: "bn-IN", kn: "kn-IN", pa: "pa-IN", ml: "ml-IN",
};

const suggestions = [
  "What crops should I grow in Kharif season?",
  "How to improve soil fertility naturally?",
  "Best pest control for tomato crops?",
  "How to apply for PM-KISAN scheme?",
];

interface Conversation { id: string; title: string; updated_at: string }

const AIAssistant = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Load conversations
  useEffect(() => {
    if (!user) return;
    supabase.from("chat_conversations").select("id, title, updated_at")
      .eq("user_id", user.id).order("updated_at", { ascending: false })
      .then(({ data }) => { if (data) setConversations(data); });
  }, [user]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConversation || !user) { setMessages([]); return; }
    supabase.from("chat_messages").select("role, content")
      .eq("conversation_id", activeConversation).order("created_at")
      .then(({ data }) => { if (data) setMessages(data as Msg[]); });
  }, [activeConversation, user]);

  const createConversation = async () => {
    if (!user) { toast({ title: "Please sign in to use AI Assistant", variant: "destructive" }); return null; }
    const { data, error } = await supabase.from("chat_conversations")
      .insert({ user_id: user.id, title: "New Chat" }).select("id, title, updated_at").single();
    if (error || !data) return null;
    setConversations(prev => [data, ...prev]);
    setActiveConversation(data.id);
    setMessages([]);
    return data.id;
  };

  const saveMessage = async (conversationId: string, role: string, content: string) => {
    if (!user) return;
    await supabase.from("chat_messages").insert({ conversation_id: conversationId, user_id: user.id, role, content });
  };

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;

    let convId = activeConversation;
    if (!convId) {
      convId = await createConversation();
      if (!convId) return;
    }

    const userMsg: Msg = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    await saveMessage(convId, "user", msg);

    // Auto-rename first message
    if (conversations.find(c => c.id === convId)?.title === "New Chat") {
      const title = msg.slice(0, 50) + (msg.length > 50 ? "..." : "");
      await supabase.from("chat_conversations").update({ title }).eq("id", convId);
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, title } : c));
    }

    let assistantSoFar = "";
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      await streamChat({
        messages: [...messages, userMsg],
        language: i18n.language !== "en" ? i18n.language : undefined,
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
        onDone: async () => {
          setIsLoading(false);
          if (assistantSoFar) await saveMessage(convId!, "assistant", assistantSoFar);
        },
        signal: abortController.signal,
      });
    } catch (e: any) {
      setIsLoading(false);
      if (e.name !== "AbortError") {
        toast({ title: "AI Error", description: e.message, variant: "destructive" });
      }
    }
  }, [input, isLoading, activeConversation, messages, i18n.language, user, conversations]);

  const deleteConversation = async (id: string) => {
    await supabase.from("chat_conversations").delete().eq("id", id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation === id) { setActiveConversation(null); setMessages([]); }
  };

  const renameConversation = async (id: string) => {
    if (!editTitle.trim()) return;
    await supabase.from("chat_conversations").update({ title: editTitle }).eq("id", id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: editTitle } : c));
    setEditingId(null);
  };

  // Voice input
  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      toast({ title: "Voice not supported", description: "Use Chrome or Edge for voice input.", variant: "destructive" });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = langMap[i18n.language] || "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <Navbar />
      <div className="pt-16 flex-1 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:relative z-40 w-72 bg-card border-r border-border h-[calc(100vh-4rem)] flex flex-col transition-transform`}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <button onClick={() => { createConversation(); setSidebarOpen(false); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex-1 justify-center">
              <Plus className="w-4 h-4" /> New Chat
            </button>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-2 text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map(conv => (
              <div key={conv.id} className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${activeConversation === conv.id ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-muted"}`}
                onClick={() => { setActiveConversation(conv.id); setSidebarOpen(false); }}>
                {editingId === conv.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && renameConversation(conv.id)} className="bg-muted rounded px-2 py-1 text-xs flex-1 outline-none" autoFocus />
                    <button onClick={(e) => { e.stopPropagation(); renameConversation(conv.id); }}><Check className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 truncate">{conv.title}</span>
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setEditingId(conv.id); setEditTitle(conv.title); }}><Edit3 className="w-3 h-3 text-muted-foreground hover:text-foreground" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}><Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {conversations.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No chats yet</p>}
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
          <div className="flex items-center gap-3 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-5 h-5 text-foreground" /></button>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Sprout className="w-5 h-5 text-primary-foreground" /></div>
            <div><h1 className="text-xl font-bold text-foreground font-display">{t("ai.title")}</h1><p className="text-xs text-muted-foreground">{t("ai.subtitle")}</p></div>
          </div>

          <div className="flex-1 bg-card border border-border rounded-2xl flex flex-col overflow-hidden mb-4">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-primary-foreground" /></div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-muted text-foreground">
                    <div className="whitespace-pre-line">{t("ai.greeting")}</div>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-primary-foreground" /></div>}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                    ) : (
                      <div className="whitespace-pre-line">{msg.content}</div>
                    )}
                  </div>
                  {msg.role === "user" && <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-secondary-foreground" /></div>}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-primary-foreground" /></div>
                  <div className="bg-muted rounded-2xl px-4 py-3"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {messages.length === 0 && (
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => handleSend(s)} className="text-xs bg-muted border border-border rounded-full px-3 py-1.5 text-foreground hover:bg-accent transition-colors">{s}</button>
                ))}
              </div>
            )}

            <div className="border-t border-border p-4 flex gap-3">
              <button onClick={toggleVoice} className={`px-3 rounded-xl transition-colors ${isListening ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()} placeholder={t("ai.inputPlaceholder")} className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none" disabled={isLoading} />
              <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="bg-primary text-primary-foreground px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
