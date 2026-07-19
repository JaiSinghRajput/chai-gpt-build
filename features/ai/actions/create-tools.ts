import { createToolRegistry } from "../tools";
import { ToolContext } from "../tools/types";

export async function createTools(context: ToolContext) {
  return createToolRegistry(context);
}