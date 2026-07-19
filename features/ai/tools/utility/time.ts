import { tool } from "ai";
import { z } from "zod";

export function createTimeTool() {
  return tool({
    description:
      "Get the current date and time in any IANA timezone. Example: Asia/Kolkata, Europe/London, America/New_York.",

    inputSchema: z.object({
      timezone: z
        .string()
        .describe("IANA timezone. Example: Asia/Kolkata"),
    }),

    execute: async ({ timezone }) => {
      try {
        const now = new Date();

        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return {
          success: true,
          timezone,
          datetime: formatter.format(now),
          iso: now.toISOString(),
        };
      } catch {
        return {
          success: false,
          error: "Invalid timezone.",
        };
      }
    },
  });
}