import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  try {

    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Check if the request has a body
    if (!req.body) {
      throw new Error("Request body is missing");
    }

    const { query } = await req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      throw new Error("OpenAI API key is missing");
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Documentation here: https://github.com/openai/openai-node
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: query }],
      // Choose model from here: https://platform.openai.com/docs/models
      model: "gpt-3.5-turbo",
      stream: false,
    });

    const reply = chatCompletion.choices[0].message.content;

    return new Response(reply, {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
