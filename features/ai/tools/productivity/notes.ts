import { tool } from "ai";
import { z } from "zod";

import { notesService } from "../../services/productivity/notes/notes";
import { ToolContext } from "../types";

export function createNotesTool(context: ToolContext) {
  return tool({
    description: `
Manage the user's personal notes.

Use this tool whenever the user wants to:
- create a note
- save information
- remember something
- list notes
- search notes
- update notes
- delete notes
- pin notes
- archive notes

Always use this tool instead of pretending to remember information.
`,

    inputSchema: z.object({
      action: z.enum([
        "create",
        "list",
        "search",
        "get",
        "update",
        "delete",
        "pin",
        "archive",
      ]),

      id: z.string().optional(),

      title: z.string().optional(),

      content: z.string().optional(),

      query: z.string().optional(),

      tags: z.array(z.string()).optional(),

      summary: z.string().optional(),

      pinned: z.boolean().optional(),

      archived: z.boolean().optional(),
    }),

    async execute(input) {
      try {
        switch (input.action) {
          case "create":
            return await notesService.createNote({
              userId: context.userId,
              conversationId: context.conversationId,
              title: input.title ?? "Untitled Note",
              content: input.content ?? "",
              summary: input.summary,
              tags: input.tags,
            });

          case "list":
            return await notesService.listNotes({
              userId: context.userId,
            });

          case "search":
            return await notesService.searchNotes({
              userId: context.userId,
              query: input.query ?? "",
            });

          case "get":
            if (!input.id) {
              return {
                success: false,
                error: "Note id is required.",
              };
            }

            return await notesService.getNote({
              userId: context.userId,
              id: input.id,
            });

          case "update":
            if (!input.id) {
              return {
                success: false,
                error: "Note id is required.",
              };
            }

            return await notesService.updateNote({
              userId: context.userId,
              id: input.id,
              title: input.title,
              content: input.content,
              summary: input.summary,
              tags: input.tags,
            });

          case "delete":
            if (!input.id) {
              return {
                success: false,
                error: "Note id is required.",
              };
            }

            return await notesService.deleteNote({
              userId: context.userId,
              id: input.id,
            });

          case "pin":
            if (!input.id) {
              return {
                success: false,
                error: "Note id is required.",
              };
            }

            return await notesService.pinNote({
              userId: context.userId,
              id: input.id,
              pinned: input.pinned ?? true,
            });

          case "archive":
            if (!input.id) {
              return {
                success: false,
                error: "Note id is required.",
              };
            }

            return await notesService.archiveNote({
              userId: context.userId,
              id: input.id,
              archived: input.archived ?? true,
            });

          default:
            return {
              success: false,
              error: "Unsupported action.",
            };
        }
      } catch (error) {
        console.error("Notes tool error:", error);

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