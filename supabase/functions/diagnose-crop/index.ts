import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image, language } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langInstruction = language ? `Respond entirely in ${language} language. ` : "";

    const systemPrompt = `${langInstruction}You are an expert agricultural plant pathologist AI. Analyze the uploaded crop/plant image and provide:

1. **Disease Identification**: Name of the disease or condition (or "Healthy" if no disease detected)
2. **Confidence Level**: Your confidence percentage (e.g., 85%)
3. **Affected Crop**: What crop/plant this appears to be
4. **Symptoms Observed**: List the visible symptoms in the image
5. **Cause**: What causes this disease (fungus, bacteria, virus, nutrient deficiency, pest, etc.)
6. **Treatment Recommendations**: 
   - Organic/natural remedies
   - Chemical treatments (with specific product names common in India)
   - Preventive measures
7. **Severity**: Low / Medium / High / Critical
8. **Action Timeline**: How urgently should the farmer act

Use emojis to make the response engaging. Be specific with product names and dosages relevant to Indian farming. If the image is not of a crop/plant, politely inform the user and ask them to upload a crop image.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this crop image for diseases and provide diagnosis with treatment recommendations." },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("diagnose error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
