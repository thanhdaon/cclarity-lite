import { LanguageModelV1StreamPart, streamText } from "ai";
import { MockLanguageModelV1 } from "ai/test";

const data: LanguageModelV1StreamPart[] = [
  { type: "text-delta", textDelta: "Hello" },
  { type: "text-delta", textDelta: ", " },
  { type: "text-delta", textDelta: "world" },
  { type: "text-delta", textDelta: "! " },
  { type: "text-delta", textDelta: "This " },
  { type: "text-delta", textDelta: "is " },
  { type: "text-delta", textDelta: "a " },
  { type: "text-delta", textDelta: "more " },
  { type: "text-delta", textDelta: "extended " },
  { type: "text-delta", textDelta: "mock " },
  { type: "text-delta", textDelta: "response " },
  { type: "text-delta", textDelta: "that " },
  { type: "text-delta", textDelta: "includes " },
  { type: "text-delta", textDelta: "several " },
  { type: "text-delta", textDelta: "additional " },
  { type: "text-delta", textDelta: "text " },
  { type: "text-delta", textDelta: "segments. " },
  { type: "text-delta", textDelta: "It " },
  { type: "text-delta", textDelta: "serves " },
  { type: "text-delta", textDelta: "as " },
  { type: "text-delta", textDelta: "an " },
  { type: "text-delta", textDelta: "example " },
  { type: "text-delta", textDelta: "of " },
  { type: "text-delta", textDelta: "how " },
  { type: "text-delta", textDelta: "the " },
  { type: "text-delta", textDelta: "streaming " },
  { type: "text-delta", textDelta: "interface " },
  { type: "text-delta", textDelta: "handles " },
  { type: "text-delta", textDelta: "larger " },
  { type: "text-delta", textDelta: "responses " },
  { type: "text-delta", textDelta: "over " },
  { type: "text-delta", textDelta: "time. " },
  { type: "text-delta", textDelta: "The " },
  { type: "text-delta", textDelta: "goal " },
  { type: "text-delta", textDelta: "is " },
  { type: "text-delta", textDelta: "to " },
  { type: "text-delta", textDelta: "ensure " },
  { type: "text-delta", textDelta: "the " },
  { type: "text-delta", textDelta: "mock " },
  { type: "text-delta", textDelta: "functionality " },
  { type: "text-delta", textDelta: "remains " },
  { type: "text-delta", textDelta: "robust " },
  { type: "text-delta", textDelta: "under " },
  { type: "text-delta", textDelta: "different " },
  { type: "text-delta", textDelta: "conditions." },
  {
    type: "finish",
    finishReason: "stop",
    usage: { completionTokens: 30, promptTokens: 5 },
  },
];

function createDelayedReadableStream<LanguageModelV1StreamPart>(
  array: LanguageModelV1StreamPart[],
  delay: number
): ReadableStream<LanguageModelV1StreamPart> {
  let index = 0;

  return new ReadableStream<LanguageModelV1StreamPart>({
    async pull(controller) {
      if (index < array.length) {
        await new Promise<void>((resolve) => setTimeout(resolve, delay));
        controller.enqueue(array[index]);
        index++;
      } else {
        controller.close();
      }
    },
  });
}

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await streamText({
    model: new MockLanguageModelV1({
      doStream: async () => ({
        stream: createDelayedReadableStream(data, 100),
        rawCall: { rawPrompt: null, rawSettings: {} },
      }),
    }),
    prompt,
  });

  return result.toDataStreamResponse();
}
