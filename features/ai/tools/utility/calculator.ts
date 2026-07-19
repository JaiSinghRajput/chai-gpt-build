import { tool } from "ai";
import { z } from "zod";

export function createCalculatorTool() {
  return tool({
    description:
      "Perform basic arithmetic calculations like addition, subtraction, multiplication, and division.",

    inputSchema: z.object({
      operation: z
        .enum(["add", "subtract", "multiply", "divide"])
        .describe("The arithmetic operation to perform."),

      a: z
        .number()
        .describe("The first number."),

      b: z
        .number()
        .describe("The second number."),
    }),

    execute: async ({ operation, a, b }) => {
      let result: number;

      switch (operation) {
        case "add":
          result = a + b;
          break;

        case "subtract":
          result = a - b;
          break;

        case "multiply":
          result = a * b;
          break;

        case "divide":
          if (b === 0) {
            return {
              success: false,
              error: "Cannot divide by zero.",
            };
          }

          result = a / b;
          break;
      }

      return {
        success: true,
        operation,
        expression: `${a} ${
          {
            add: "+",
            subtract: "-",
            multiply: "×",
            divide: "÷",
          }[operation]
        } ${b}`,
        result,
      };
    },
  });
}