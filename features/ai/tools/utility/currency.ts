import { tool } from "ai";
import { z } from "zod";

export function createCurrencyConverterTool() {
  return tool({
    description:
      "Convert one currency into another using live exchange rates.",

    inputSchema: z.object({
      from: z
        .string()
        .length(3)
        .describe("Source currency code. Example: USD"),

      to: z
        .string()
        .length(3)
        .describe("Target currency code. Example: INR"),

      amount: z
        .number()
        .positive()
        .describe("Amount to convert."),
    }),

    execute: async ({ from, to, amount }) => {
      try {
        const response = await fetch(
          `https://open.er-api.com/v6/latest/${from.toUpperCase()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates.");
        }

        const data = await response.json();

        if (!data.rates?.[to.toUpperCase()]) {
          return {
            success: false,
            error: "Unsupported currency.",
          };
        }

        const rate = data.rates[to.toUpperCase()];
        const converted = amount * rate;

        return {
          success: true,
          from: from.toUpperCase(),
          to: to.toUpperCase(),
          amount,
          exchangeRate: rate,
          convertedAmount: Number(converted.toFixed(2)),
          lastUpdated: data.time_last_update_utc,
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Currency conversion failed.",
        };
      }
    },
  });
}