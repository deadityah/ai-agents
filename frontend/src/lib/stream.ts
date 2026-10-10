// SSE streaming client supporting real backend API and transparent mock fallback

import { SSEEvent, Depth } from "./types";
import { getClientId } from "./clientId";
import { mockStream, StartResearchParams } from "./mockStream";

export async function startResearch({
  topic,
  depth,
  signal,
  onEvent,
}: StartResearchParams): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  // If no backend API URL configured, run via mockStream automatically
  if (!apiUrl) {
    return mockStream({ topic, depth, signal, onEvent, mockVariant: "stream" });
  }

  const clientId = getClientId();

  try {
    const res = await fetch(`${apiUrl}/api/research`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic.trim(),
        depth,
        client_id: clientId,
      }),
      signal,
    });

    if (!res.ok) {
      let errorMsg = "Something went wrong. Please try again.";
      try {
        const errJson = await res.json();
        errorMsg = errJson.message || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    if (!res.body) {
      throw new Error("No response body received from stream.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        const lines = part.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const jsonStr = line.slice(5).trim();
            if (jsonStr) {
              try {
                const event = JSON.parse(jsonStr) as SSEEvent;
                onEvent(event);
              } catch (parseErr) {
                console.warn("Failed to parse SSE event JSON:", line, parseErr);
              }
            }
          }
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      // AbortError resolves quietly on cancellation or unmount
      return;
    }
    throw err;
  }
}
