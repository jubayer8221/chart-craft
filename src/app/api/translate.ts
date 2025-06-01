// utils/translate.ts

export async function translateText(text: string, targetLang: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // store your key in .env.local
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // or another model you want to use
      messages: [
        { role: "system", content: "You are a helpful translator." },
        { role: "user", content: `Translate this to ${targetLang}: "${text}"` },
      ],
      max_tokens: 60,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Extract the translated text from the response
  return data.choices[0].message.content.trim();
}
