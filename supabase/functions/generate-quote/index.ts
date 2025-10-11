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
  "motivacao-reversa": "Gere uma frase de motivação reversa, direta e provocativa. Use um tom firme, sem rodeios, que desafie a pessoa a agir imediatamente. Exemplo de estilo: 'Pare de reclamar e comece a fazer.' ou 'Ninguém vai fazer por você, levanta e vai.' A frase deve ser curta (máximo 200 caracteres), impactante e motivar através da realidade crua.",
  aleatoria: "Gere uma frase inspiradora sobre qualquer tema positivo.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, excludeTexts = [] } = await req.json();
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating quote for category:', category, 'excluding:', excludeTexts.length, 'quotes');

    const prompt = categoryPrompts[category] || categoryPrompts.aleatoria;
    const maxAttempts = 3;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Attempt ${attempt}/${maxAttempts}`);
      
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
              content: 'Você é um gerador de frases inspiradoras. Retorne APENAS um JSON válido com os campos "frase" e "autor". A frase deve ser curta (máximo 200 caracteres), original, autêntica e impactante. Para motivação reversa, use tom direto e provocativo. Não inclua explicações adicionais ou formatação markdown. IMPORTANTE: Gere uma frase completamente diferente das anteriores.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
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
        
        // Check if quote is in excluded list
        if (!excludeTexts.includes(quoteData.frase)) {
          console.log('Generated unique quote on attempt', attempt);
          return new Response(JSON.stringify(quoteData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        console.log('Quote was in history, trying again...');
      } catch (parseError) {
        console.error('Error parsing AI response:', content);
      }
    }
    
    // If all attempts failed, return fallback
    console.log('All attempts exhausted, returning fallback');
    return new Response(
      JSON.stringify({ 
        frase: "A persistência é o caminho do êxito.",
        autor: "Charlie Chaplin"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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
