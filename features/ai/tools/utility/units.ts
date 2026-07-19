import { tool } from "ai";
import { z } from "zod";

export function createUnitConverterTool() {
  return tool({
    description:
      "Convert between common units of length, weight and temperature.",

    inputSchema: z.object({
      category: z.enum([
        "length",
        "weight",
        "temperature",
      ]),

      from: z.string(),

      to: z.string(),

      value: z.number(),
    }),

    execute: async ({ category, from, to, value }) => {
      const f = from.toLowerCase();
      const t = to.toLowerCase();

      try {
        let result: number;

        if (category === "length") {
          const factors: Record<string, number> = {
            mm: 0.001,
            cm: 0.01,
            m: 1,
            km: 1000,
            in: 0.0254,
            ft: 0.3048,
            yd: 0.9144,
            mi: 1609.344,
          };

          if (!(f in factors) || !(t in factors))
            throw new Error("Unsupported unit.");

          result = (value * factors[f]) / factors[t];
        } else if (category === "weight") {
          const factors: Record<string, number> = {
            mg: 0.001,
            g: 1,
            kg: 1000,
            oz: 28.3495,
            lb: 453.592,
          };

          if (!(f in factors) || !(t in factors))
            throw new Error("Unsupported unit.");

          result = (value * factors[f]) / factors[t];
        } else {
          if (f === "c" && t === "f") {
            result = (value * 9) / 5 + 32;
          } else if (f === "f" && t === "c") {
            result = ((value - 32) * 5) / 9;
          } else if (f === "c" && t === "k") {
            result = value + 273.15;
          } else if (f === "k" && t === "c") {
            result = value - 273.15;
          } else if (f === "f" && t === "k") {
            result = ((value - 32) * 5) / 9 + 273.15;
          } else if (f === "k" && t === "f") {
            result = ((value - 273.15) * 9) / 5 + 32;
          } else if (f === t) {
            result = value;
          } else {
            throw new Error("Unsupported unit.");
          }
        }

        return {
          success: true,
          category,
          from,
          to,
          input: value,
          result: Number(result.toFixed(4)),
        };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Conversion failed.",
        };
      }
    },
  });
}