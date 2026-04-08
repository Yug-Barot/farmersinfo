import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Loader2, AlertTriangle, Leaf, RefreshCw, X, History, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DIAGNOSE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diagnose-crop`;

const DiseaseDetection = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const diagnosisCompleteRef = useRef(false);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("disease_diagnoses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setHistory(data);
  };

  const saveDiagnosis = async (text: string) => {
    if (!user) return;
    // Try to extract info from the diagnosis text
    const cropMatch = text.match(/Affected Crop[:\s]*\*?\*?([^*\n]+)/i);
    const diseaseMatch = text.match(/Disease Identification[:\s]*\*?\*?([^*\n]+)/i);
    const severityMatch = text.match(/Severity[:\s]*\*?\*?([^*\n]+)/i);
    const confidenceMatch = text.match(/Confidence[:\s]*\*?\*?([^*\n%]+%?)/i);

    await supabase.from("disease_diagnoses").insert({
      user_id: user.id,
      diagnosis_text: text,
      crop_name: cropMatch?.[1]?.trim() || null,
      disease_name: diseaseMatch?.[1]?.trim() || null,
      severity: severityMatch?.[1]?.trim() || null,
      confidence: confidenceMatch?.[1]?.trim() || null,
      image_url: null, // Don't store base64 in DB
    });
    fetchHistory();
  };

  const deleteHistory = async (id: string) => {
    await supabase.from("disease_diagnoses").delete().eq("id", id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    toast.success("Diagnosis deleted");
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setDiagnosis("");
      diagnosisCompleteRef.current = false;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const analyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setDiagnosis("");
    diagnosisCompleteRef.current = false;

    try {
      const languageMap: Record<string, string> = {
        hi: "Hindi", bn: "Bengali", ta: "Tamil", te: "Telugu",
        mr: "Marathi", gu: "Gujarati", kn: "Kannada", ml: "Malayalam", pa: "Punjabi",
      };

      const resp = await fetch(DIAGNOSE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          image,
          language: languageMap[i18n.language] || null,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || "Analysis failed");
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              result += content;
              setDiagnosis(result);
            }
          } catch { /* partial */ }
        }
      }

      // Save completed diagnosis
      if (result && user) {
        diagnosisCompleteRef.current = true;
        await saveDiagnosis(result);
        toast.success("Diagnosis saved to history!");
      }
    } catch (err: any) {
      toast.error(err.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setDiagnosis("");
    diagnosisCompleteRef.current = false;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14">
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-accent/50 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Leaf className="w-4 h-4" /> AI-Powered Disease Detection
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Crop Disease Detection
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload or capture a photo of your crop to get instant AI diagnosis with treatment recommendations
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="bg-card rounded-xl border border-border p-6 h-full">
                  <h2 className="font-display font-bold text-lg text-foreground mb-4">Upload Crop Image</h2>

                  {!image ? (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-foreground font-medium mb-1">Drag & drop or click to upload</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG up to 10MB</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={image} alt="Uploaded crop" className="w-full rounded-xl object-cover max-h-[300px]" />
                      <button onClick={reset} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:opacity-80">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
                    >
                      <Upload className="w-4 h-4" /> Gallery
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 flex items-center justify-center gap-2 bg-accent text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
                    >
                      <Camera className="w-4 h-4" /> Camera
                    </button>
                  </div>

                  <button
                    onClick={analyze}
                    disabled={!image || isAnalyzing}
                    className="w-full mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                    ) : (
                      <><Leaf className="w-5 h-5" /> Diagnose Disease</>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Results Section */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-card rounded-xl border border-border p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-bold text-lg text-foreground">Diagnosis Results</h2>
                    {diagnosis && (
                      <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5" /> New Scan
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {isAnalyzing && !diagnosis ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 text-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-foreground font-medium">Analyzing your crop...</p>
                        <p className="text-sm text-muted-foreground mt-1">AI is examining the image</p>
                      </motion.div>
                    ) : diagnosis ? (
                      <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-sm max-w-none text-foreground overflow-y-auto max-h-[450px] pr-2">
                        <ReactMarkdown>{diagnosis}</ReactMarkdown>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                        <AlertTriangle className="w-10 h-10 text-muted-foreground/40 mb-4" />
                        <p className="text-foreground font-medium">No image uploaded yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Upload or capture a photo of your crop to get started</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* History Section */}
            {user && history.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-4xl mx-auto mt-8">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between bg-card rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-2 text-foreground font-display font-bold">
                    <History className="w-5 h-5 text-primary" />
                    Past Diagnoses ({history.length})
                  </div>
                  {showHistory ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 mt-3">
                        {history.map((item) => (
                          <div key={item.id} className="bg-card rounded-xl border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  {item.disease_name && (
                                    <span className="text-sm font-semibold text-foreground">{item.disease_name}</span>
                                  )}
                                  {item.crop_name && (
                                    <span className="text-xs bg-accent text-foreground px-2 py-0.5 rounded-full">{item.crop_name}</span>
                                  )}
                                  {item.severity && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      item.severity.toLowerCase().includes("high") || item.severity.toLowerCase().includes("critical")
                                        ? "bg-destructive/20 text-destructive"
                                        : item.severity.toLowerCase().includes("medium")
                                        ? "bg-secondary/20 text-secondary-foreground"
                                        : "bg-primary/20 text-primary"
                                    }`}>
                                      {item.severity}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                  className="text-xs text-primary hover:underline"
                                >
                                  {expandedId === item.id ? "Hide" : "View"}
                                </button>
                                <button onClick={() => deleteHistory(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <AnimatePresence>
                              {expandedId === item.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 pt-3 border-t border-border prose prose-sm max-w-none text-foreground max-h-[300px] overflow-y-auto">
                                    <ReactMarkdown>{item.diagnosis_text}</ReactMarkdown>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DiseaseDetection;
