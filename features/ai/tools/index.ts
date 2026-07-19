import { createWeatherTool } from "./weather";
import { createCalculatorTool } from "./calculator";
import { createSearchTool } from "./search";

export function createToolRegistry() {
  return {
    weather: createWeatherTool(),
    calculator: createCalculatorTool(),
    search: createSearchTool(),
  };
}