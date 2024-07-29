import { azure } from "@ai-sdk/azure";
import { CoreMessage, generateText, streamText } from "ai";

export async function POST(req: Request) {
  const { messages, system }: { messages: CoreMessage[]; system: string } =
    await req.json();

  const result = await streamText({
    model: azure("tenk-ai-workshop-2024"),
    system: system || "You´re a friendly assistant",
    messages,
  });

  return result.toAIStreamResponse();
}
