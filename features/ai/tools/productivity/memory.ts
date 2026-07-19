import { tool } from "ai";
import { z } from "zod";

import { memoryService } from "../../services/productivity/memory/memory";
import { ToolContext } from "../types";

const inputSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("remember"),
    key: z.string(),
    value: z.string(),
    type: z
      .enum(["PREFERENCE", "PROFILE", "PROJECT", "CUSTOM"])
      .optional(),
  }),

  z.object({
    action: z.literal("recall"),
    key: z.string(),
  }),

  z.object({
    action: z.literal("recallAll"),
  }),

  z.object({
    action: z.literal("search"),
    query: z.string(),
  }),

  z.object({
    action: z.literal("update"),
    key: z.string(),
    value: z.string(),
  }),

  z.object({
    action: z.literal("forget"),
    key: z.string(),
  }),
]);

export function createMemoryTool(context: ToolContext) {
  return tool({
    description: `
Manage long-term user memory.

Use this tool whenever the user asks you to:

- remember something
- save a personal preference
- save profile information
- save project information
- forget something
- recall something
- list everything you remember
- search remembered information

Do NOT use this tool for long documents or notes.
Use the Notes tool for large pieces of text.
`,

    inputSchema,

    async execute(input) {
      try {
        switch (input.action) {
          case "remember":
            return await memoryService.remember({
              userId: context.userId,
              key: input.key,
              value: input.value,
              type: input.type,
            });

          case "recall":
            return await memoryService.recall({
              userId: context.userId,
              key: input.key,
            });

          case "recallAll":
            return await memoryService.recallAll({
              userId: context.userId,
            });

          case "search":
            return await memoryService.search({
              userId: context.userId,
              query: input.query,
            });

          case "update":
            return await memoryService.update({
              userId: context.userId,
              key: input.key,
              value: input.value,
            });

          case "forget":
            return await memoryService.forget({
              userId: context.userId,
              key: input.key,
            });

          default:
            return {
              success: false,
              error: "Unsupported action.",
            };
        }
      } catch (error) {
        console.error("Memory tool error:", error);

        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unexpected error.",
        };
      }
    },
  });
}