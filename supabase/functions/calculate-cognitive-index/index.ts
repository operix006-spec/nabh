// Supabase Edge Function: calculate-cognitive-index
// Deno TypeScript environment for Supabase Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, sessionId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user recent sessions across all 7 cognitive domains
    const { data: sessions, error: sessionsError } = await supabaseClient
      .from("game_sessions")
      .select("score, accuracy_rate, mean_reaction_time_ms, created_at, skill_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (sessionsError) throw sessionsError;

    // Calculate weighted cognitive index (0 - 1000)
    let totalScore = 0;
    let totalWeight = 0;

    sessions?.forEach((s, index) => {
      // Recency exponential decay weight
      const weight = Math.exp(-index * 0.05);
      const normalizedScore = Math.min(1000, Math.max(0, s.score));
      totalScore += normalizedScore * weight;
      totalWeight += weight;
    });

    const calculatedIndex = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 500;

    // Update user profile
    await supabaseClient
      .from("profiles")
      .update({ cognitive_index: calculatedIndex, updated_at: new Date().toISOString() })
      .eq("id", userId);

    return new Response(
      JSON.stringify({
        success: true,
        cognitiveIndex: calculatedIndex,
        sessionsEvaluated: sessions?.length || 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
