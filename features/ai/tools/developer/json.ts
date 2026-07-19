import { tool } from "ai";
import { z } from "zod";
import { jsonService } from "../../services/developers/json/json";

const inputSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("format"),
    json: z.string(),
    indent: z.number().int().min(2).max(8).optional(),
  }),

  z.object({
    action: z.literal("minify"),
    json: z.string(),
  }),

  z.object({
    action: z.literal("validate"),
    json: z.string(),
  }),

  z.object({
    action: z.literal("repair"),
    json: z.string(),
  }),
]);

export function createJsonTool() {
  return tool({
    description: `
Work with JSON data.

Use this tool whenever the user asks to:

- format JSON
- pretty print JSON
- beautify JSON
- minify JSON
- validate JSON
- repair malformed JSON

Always use this tool instead of manually formatting JSON.
`,

    inputSchema,

    async execute(input) {
      try {
        switch (input.action) {
          case "format":
            return await jsonService.format({
              json: input.json,
              indent: input.indent,
            });

          case "minify":
            return await jsonService.minify({
              json: input.json,
            });

          case "validate":
            return await jsonService.validate({
              json: input.json,
            });

          case "repair":
            return await jsonService.repair({
              json: input.json,
            });

          default:
            return {
              success: false,
              error: "Unsupported action.",
            };
        }
      } catch (error) {
        console.error("JSON tool error:", error);

        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        };
      }
    },
  });
}