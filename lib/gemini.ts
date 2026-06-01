const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export type GeminiResult = {
  text: string;
  durationMs: number;
};

export async function runGemini(
  prompt: string,
  apiKey: string,
  signal?: AbortSignal,
): Promise<GeminiResult> {
  const startedAt = performance.now();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Gemini API error ${res.status}: ${body.slice(0, 300) || res.statusText}`,
    );
  }

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text =
    json.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim() ?? "";

  return { text, durationMs: performance.now() - startedAt };
}

export async function runGeminiBatch(
  prompt: string,
  apiKey: string,
  iterations: number,
  signal?: AbortSignal,
): Promise<GeminiResult[]> {
  return Promise.all(
    Array.from({ length: iterations }, () => runGemini(prompt, apiKey, signal)),
  );
}
