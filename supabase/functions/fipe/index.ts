import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FIPE_API_BASE = 'https://parallelum.com.br/fipe/api/v2';

interface FipeRequest {
  action: 'marcas' | 'modelos' | 'anos' | 'valor';
  tipo: 'carros' | 'motos' | 'caminhoes';
  marcaId?: string;
  modeloId?: string;
  anoId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, tipo, marcaId, modeloId, anoId }: FipeRequest = await req.json();

    console.log(`FIPE request: action=${action}, tipo=${tipo}, marcaId=${marcaId}, modeloId=${modeloId}, anoId=${anoId}`);

    let url = `${FIPE_API_BASE}/${tipo}`;

    switch (action) {
      case 'marcas':
        url += '/marcas';
        break;
      case 'modelos':
        if (!marcaId) {
          return new Response(
            JSON.stringify({ error: 'marcaId é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        url += `/marcas/${marcaId}/modelos`;
        break;
      case 'anos':
        if (!marcaId || !modeloId) {
          return new Response(
            JSON.stringify({ error: 'marcaId e modeloId são obrigatórios' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        url += `/marcas/${marcaId}/modelos/${modeloId}/anos`;
        break;
      case 'valor':
        if (!marcaId || !modeloId || !anoId) {
          return new Response(
            JSON.stringify({ error: 'marcaId, modeloId e anoId são obrigatórios' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        url += `/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Ação inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Fetching FIPE API: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`FIPE API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `Erro na API FIPE: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`FIPE response: ${JSON.stringify(data).substring(0, 200)}...`);

    // If fetching valor, save to cache
    if (action === 'valor' && data.codigoFipe) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        await supabase
          .from('fipe_cache')
          .upsert({
            tipo,
            codigo_fipe: data.codigoFipe,
            marca: data.marca,
            modelo: data.modelo,
            ano_modelo: data.anoModelo?.toString() || anoId,
            combustivel: data.combustivel,
            valor: data.valor,
            mes_referencia: data.mesReferencia,
            dados: data,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'codigo_fipe,ano_modelo'
          });

        console.log(`Cached FIPE data for ${data.codigoFipe}`);
      } catch (cacheError) {
        console.error('Error caching FIPE data:', cacheError);
        // Don't fail the request if cache fails
      }
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in FIPE function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
