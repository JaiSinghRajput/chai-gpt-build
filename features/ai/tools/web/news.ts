import { tool } from "ai";
import { z } from "zod";
import { XMLParser } from "fast-xml-parser";

const TOPICS = {
  world: "WORLD",
  nation: "NATION",
  business: "BUSINESS",
  technology: "TECHNOLOGY",
  entertainment: "ENTERTAINMENT",
  sports: "SPORTS",
  science: "SCIENCE",
  health: "HEALTH",
} as const;

export function createNewsTool() {
  return tool({
    description:
      "Get the latest news headlines or search for news articles from Google News.",

    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe("Search query. Example: OpenAI, Bitcoin, Cricket."),

      category: z
        .enum([
          "general",
          "world",
          "nation",
          "business",
          "technology",
          "entertainment",
          "sports",
          "science",
          "health",
        ])
        .default("general")
        .describe("News category."),

      language: z
        .string()
        .default("en")
        .describe("Language code."),

      country: z
        .string()
        .default("IN")
        .describe("Country code."),

      limit: z
        .number()
        .min(1)
        .max(10)
        .default(5)
        .describe("Maximum number of articles."),
    }),

    execute: async ({
      query,
      category,
      language,
      country,
      limit,
    }) => {
      try {
        let url: string;

        if (query) {
          url = `https://news.google.com/rss/search?q=${encodeURIComponent(
            query
          )}&hl=${language}-${country}&gl=${country}&ceid=${country}:${language}`;
        } else if (category === "general") {
          url = `https://news.google.com/rss?hl=${language}-${country}&gl=${country}&ceid=${country}:${language}`;
        } else {
          url = `https://news.google.com/rss/headlines/section/topic/${
            TOPICS[category]
          }?hl=${language}-${country}&gl=${country}&ceid=${country}:${language}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch news.");
        }

        const xml = await response.text();

        const parser = new XMLParser({
          ignoreAttributes: false,
          htmlEntities: true,
        });

        const feed = parser.parse(xml);

        const items = feed.rss.channel.item ?? [];

        return {
          success: true,

          articles: items.slice(0, limit).map((item: any) => ({
            title: item.title,
            description: item.description,
            link: item.link,
            publishedAt: item.pubDate,
            source:
              typeof item.source === "object"
                ? item.source["#text"]
                : item.source,
          })),
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch news.",
        };
      }
    },
  });
}