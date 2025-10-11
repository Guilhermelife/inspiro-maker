import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Daily quote update triggered');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Random categories
    const categories = ['motivacao', 'inspiracao', 'sabedoria', 'amor'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    console.log(`Generating quote for category: ${randomCategory}`);

    // Generate quote using Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um gerador de frases inspiradoras em português. Gere frases originais, profundas e motivadoras.'
          },
          {
            role: 'user',
            content: `Gere uma frase ${randomCategory === 'motivacao' ? 'motivadora' : randomCategory === 'inspiracao' ? 'inspiradora' : randomCategory === 'sabedoria' ? 'de sabedoria' : 'sobre amor'} original em português brasileiro. A frase deve ser curta (máximo 150 caracteres), impactante e positiva. Retorne APENAS a frase, sem aspas ou formatação adicional.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedText = aiData.choices[0].message.content.trim();

    console.log('Generated quote:', generatedText);

    // Insert into database
    const { data, error } = await supabase
      .from('quotes')
      .insert({
        text: generatedText,
        author: 'Gerado por IA',
        category: randomCategory,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Quote inserted successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        quote: data,
        message: 'Nova frase adicionada com sucesso!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in daily-quote-update:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
