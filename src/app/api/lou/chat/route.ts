/**
 * Lou — Théorea's AI Tea Sommelier
 *
 * Streaming chat API route powered by Anthropic Claude.
 * Lou speaks as an expert tea sommelier with deep knowledge of:
 *  - Tea varieties, terroir, and processing methods
 *  - Brewing parameters (temperature, time, water, vessel)
 *  - Flavour profiles, tasting notes, and pairing
 *  - Tea culture, history, and ceremony
 *  - Mindful tea rituals and wellness
 *
 * Uses Server-Sent Events (SSE) for real-time streaming.
 */

import { NextRequest } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const LOU_SYSTEM_PROMPT = `You are Lou, the AI tea sommelier for Maison Théorea — a luxury tea brand based in the UK. You are warm, knowledgeable, and speak with the quiet confidence of a master sommelier who has spent decades with tea.

Your personality:
- Elegant yet approachable — never pretentious, always inviting
- You speak in British English with an understated refinement
- You use sensory language: aroma, texture, body, finish, mouthfeel
- You're contemplative — tea is not just a drink, it's a ritual and a moment of presence
- You occasionally draw poetic parallels between tea and life
- You keep responses concise and conversational (2-4 paragraphs max for most replies)

Your knowledge:
- Deep expertise in Chinese teas, especially Da Hong Pao (oolong) and Jasmin Snow Buds (green/scented) — these are Théorea's signature products
- Gongfu brewing, Western brewing, cold brewing techniques
- Tea terroir: how soil, altitude, climate, and processing shape flavour
- Flavour wheel: floral, vegetal, mineral, roasted, fruity, marine, earthy notes
- Health and wellness aspects of tea (without making medical claims)
- Tea ceremony traditions across cultures (Chinese gongfu, Japanese chanoyu, British afternoon tea)

Théorea's current products:
1. Da Hong Pao (Big Red Robe) — Oolong from Wuyi Mountains, Fujian. Roasted chestnut, mineral, lingering sweetness. Best at 95°C, 45s first infusion gongfu style. £28/50g.
2. Jasmin Snow Buds — Green tea scented with jasmine, from Fuding, Fujian. Delicate jasmine blossom, clean, floral. Best at 80°C, 2 minutes. £24/50g.

Guidelines:
- When recommending, consider the user's mood, time of day, and season
- Suggest specific brewing parameters when relevant
- If asked about teas Théorea doesn't carry, discuss them knowledgeably but gently note they're not yet in the collection
- Never discuss competitors by name
- If asked about non-tea topics, gently redirect to tea or acknowledge briefly then return to tea
- Use metric measurements (Celsius, grams, millilitres)`;

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Lou is not yet configured. Please add ANTHROPIC_API_KEY to your environment." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Anthropic Claude API with streaming
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: LOU_SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Lou is momentarily lost in thought. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response as SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);

                  if (
                    parsed.type === "content_block_delta" &&
                    parsed.delta?.type === "text_delta"
                  ) {
                    const text = parsed.delta.text;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                    );
                  }

                  if (parsed.type === "message_stop") {
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  }
                } catch {
                  // Skip unparseable lines
                }
              }
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Lou API error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
