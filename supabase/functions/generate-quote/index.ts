import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const categoryPrompts: Record<string, string> = {
  motivacional: "Gere uma frase motivacional inspiradora e original que encoraje as pessoas a persistirem e acreditarem em si mesmas.",
  reflexiva: "Gere uma frase reflexiva profunda sobre a vida, sabedoria ou autoconhecimento.",
  biblica: "Gere uma citação bíblica inspiradora com o versículo.",
  autor: "Gere uma frase inspiradora de um autor famoso, filósofo ou pensador reconhecido.",
  amor: "Gere uma frase sobre amor, espiritualidade, compaixão ou gratidão.",
  aleatoria: "Gere uma frase inspiradora sobre qualquer tema positivo.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = categoryPrompts[category] || categoryPrompts.aleatoria;
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um gerador de frases inspiradoras. Retorne APENAS um JSON válido com os campos "frase" e "autor". A frase deve ser curta (máximo 280 caracteres), original e inspiradora. Não inclua explicações adicionais.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response
    let quoteData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                       content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      quoteData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Error parsing AI response:', content);
      // Fallback response
      quoteData = {
        frase: "Acredite em si mesmo e tudo será possível.",
        autor: "Anônimo"
      };
    }

    return new Response(JSON.stringify(quoteData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-quote function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        frase: "Cada dia é uma nova oportunidade para recomeçar.",
        autor: "Anônimo"
      }), 
      {
        status: 200, // Return 200 with fallback quote instead of error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
