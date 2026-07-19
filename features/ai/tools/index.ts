
import { createSearchTool } from "./web/search";
import { createCalculatorTool } from "./utility/calculator";
import { createCurrencyConverterTool } from "./utility/currency";
import { createTimeTool } from "./utility/time";
import { createUnitConverterTool } from "./utility/units";
import { createWeatherTool } from "./web/weather";
import {createNewsTool} from "./web/news";
import { ToolContext } from "./types";
import { createNotesTool } from "./productivity/notes";
import { createMemoryTool } from "./productivity/memory";
import { createJsonTool } from "./developer/json";
import { createGithubTool } from "./github";

export function createToolRegistry(context: ToolContext) {
  return {
    calculator: createCalculatorTool(),
    weather: createWeatherTool(),
    news: createNewsTool(),
    search: createSearchTool(),
    time: createTimeTool(),
    units: createUnitConverterTool(),
    currency: createCurrencyConverterTool(),
    json: createJsonTool(),
    github:createGithubTool(),
     notes: createNotesTool(context),
     memory:createMemoryTool(context),
  };
}