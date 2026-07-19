import { tool } from "ai";
import { z } from "zod";

export function createSearchTool() {
  return tool({
    description:
      "Search the web for information about any topic, person, place, or thing.",

    inputSchema: z.object({
      query: z
        .string()
        .describe("The search query to look up on the web."),
    }),

    execute: async ({ query }) => {
      const response = await fetch(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(
          query
        )}&format=json&no_html=1&skip_disambig=1`
      );

      if (!response.ok) {
        throw new Error("Failed to search the web.");
      }

      const data = await response.json();

      return {
        success: true,
        query,
        heading: data.Heading,
        summary: data.Abstract || null,
        source: data.AbstractSource || null,
        url: data.AbstractURL || null,
        relatedTopics: (data.RelatedTopics || [])
          .slice(0, 5)
          .map((topic: any) => ({
            text: topic.Text,
            url: topic.FirstURL,
          })),
      };
    },
  });
}