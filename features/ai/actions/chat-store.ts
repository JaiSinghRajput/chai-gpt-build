"use server";

import { isTextUIPart, type UIMessage } from "ai";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/db";

/** Extracts plain text from an AI SDK `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
  return message.parts.filter(isTextUIPart).map((part) => part.text).join("");
}

/**
 * Normalizes stored message parts from the database into AI SDK `UIMessage` parts.
 * Falls back to a single text part when no structured parts are stored.
 */
function toUIMessageParts(
  parts: Prisma.JsonValue | null,
  content: string
): UIMessage["parts"] {
  const stored = parts as UIMessage["parts"] | null;
  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  return [{ type: "text", text: content }];
}

/** Resolves the id of a conversation's default ("main") branch. */
export async function getDefaultBranchId(conversationId: string) {
  const existing = await prisma.branch.findFirst({
    where: { conversationId, isDefault: true },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.branch.create({
    data: { conversationId, name: "main", isDefault: true },
    select: { id: true },
  });
  return created.id;
}

type MessageRow = {
  id: string;
  role: string;
  content: string;
  parts: Prisma.JsonValue | null;
  createdAt: Date;
};

/**
 * Loads all messages for a branch from the database as AI SDK `UIMessage`s, by
 * walking the message tree from the branch's head back to the root. This
 * naturally includes shared history inherited from any ancestor branch.
 *
 * @param conversationId - The conversation whose messages to load.
 * @param branchId - The branch whose transcript to load. Defaults to the
 *   conversation's main branch.
 * @returns Messages ordered oldest to newest, ready for `useChat`.
 */
export async function loadChatMessages(
  conversationId: string,
  branchId?: string
): Promise<UIMessage[]> {
  const activeBranchId = branchId ?? (await getDefaultBranchId(conversationId));

  const branch = await prisma.branch.findUniqueOrThrow({
    where: { id: activeBranchId },
    select: { headMessageId: true },
  });

  if (!branch.headMessageId) return [];

  const rows = await prisma.$queryRaw<MessageRow[]>`
    WITH RECURSIVE thread AS (
      SELECT id, role, content, parts, "createdAt", "parentId"
      FROM "Message" WHERE id = ${branch.headMessageId}
      UNION ALL
      SELECT m.id, m.role, m.content, m.parts, m."createdAt", m."parentId"
      FROM "Message" m
      INNER JOIN thread t ON m.id = t."parentId"
    )
    SELECT id, role, content, parts, "createdAt" FROM thread
    ORDER BY "createdAt" ASC
  `;

  return rows.map((row) => ({
    id: row.id,
    role: row.role === "ASSISTANT" ? "assistant" : "user",
    parts: toUIMessageParts(row.parts, row.content),
  }));
}

type SaveChatMessagesOptions = {
  updateTitle?: boolean;
  /** Branch to attach new messages to. Defaults to the conversation's main branch. */
  branchId?: string;
};

/**
 * Upserts AI SDK `UIMessage`s into the database for a conversation branch.
 *
 * New messages are appended to the branch's tree (parented on the branch's
 * current head) and advance the branch head; already-existing messages only
 * have their content/parts refreshed, never their tree position.
 *
 * @param conversationId - Target conversation ID.
 * @param messages - Messages to persist (system messages are skipped).
 * @param options.updateTitle - When true, auto-titles "New Chat" from the first user message.
 * @param options.branchId - Branch to save into. Defaults to the main branch.
 */
export async function saveChatMessages(
  conversationId: string,
  messages: UIMessage[],
  options: SaveChatMessagesOptions = {}
) {
  const { updateTitle = true } = options;
  const branchId = options.branchId ?? (await getDefaultBranchId(conversationId));

  const branch = await prisma.branch.findUniqueOrThrow({
    where: { id: branchId },
    select: { headMessageId: true },
  });

  let parentId = branch.headMessageId;
  let newHeadId = parentId;

  for (const message of messages) {
    if (message.role === "system") continue;

    const content = getMessageText(message);
    const role = message.role === "assistant" ? "ASSISTANT" : "USER";

    const existing = await prisma.message.findUnique({
      where: { id: message.id },
      select: { id: true },
    });

    if (existing) {
      await prisma.message.update({
        where: { id: message.id },
        data: {
          content,
          parts: message.parts as Prisma.InputJsonValue,
          status: "COMPLETE",
        },
      });
      // Existing messages keep their original tree position; they don't
      // move the branch head or become someone else's parent here.
      continue;
    }

    await prisma.message.create({
      data: {
        id: message.id,
        conversationId,
        branchId,
        parentId,
        role,
        status: "COMPLETE",
        content,
        parts: message.parts as Prisma.InputJsonValue,
      },
    });

    parentId = message.id;
    newHeadId = message.id;
  }

  if (newHeadId !== branch.headMessageId) {
    await prisma.branch.update({
      where: { id: branchId },
      data: { headMessageId: newHeadId },
    });
  }

  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: { id: conversationId },
    select: { title: true },
  });

  const firstUser = messages.find((message) => message.role === "user");
  const firstUserText = firstUser ? getMessageText(firstUser).trim() : "";

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageAt: new Date(),
      title:
        updateTitle && conversation.title === "New Chat" && firstUserText
          ? firstUserText.slice(0, 48)
          : conversation.title,
    },
  });
}