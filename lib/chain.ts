import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const responseSchema = z.object({
  summary: z
    .string()
    .describe("A concise summary of the repository"),
  coolFacts: z
    .array(z.string())
    .describe("A list of interesting facts about the repository"),
});

export type SummarizeReadmeResult = z.infer<typeof responseSchema>;

export async function summarizeReadme(
  readmeContent: string
): Promise<SummarizeReadmeResult> {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const structuredModel = model.withStructuredOutput(responseSchema);

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert at summarizing open source GitHub repositories from their README files.",
    ],
    [
      "human",
      "Summarize this GitHub repository from this README file:\n\n{readmeContent}",
    ],
  ]);

  const chain = prompt.pipe(structuredModel);

  return chain.invoke({ readmeContent });
}
