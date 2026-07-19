"use server";

import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db";


/**
 * Server action that reuses the user's most recent empty "New Chat" conversation
 * if one exists, otherwise creates a new conversation (with its default "main" branch).
 *
 * @returns The ID of the conversation to use.
 */
export async function startNewChat() {
    const user = await requireUser();

    const existingEmpty = await prisma.conversation.findFirst({
        where: {
            userId: user.id,
            title: "New Chat",
            isArchived: false,
            messages: { none: {} },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
    });

    if (existingEmpty) {
        return existingEmpty.id;
    }

    const conversation = await prisma.$transaction(async (tx) => {
        const conv = await tx.conversation.create({
            data: {
                userId: user.id,
                title: "New Chat",
            },
        });

        await tx.branch.create({
            data: {
                conversationId: conv.id,
                name: "main",
                isDefault: true,
            },
        });

        return conv;
    });

    return conversation.id;
}