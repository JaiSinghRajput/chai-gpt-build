"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/features/auth/action/require-user";
import { revalidatePath } from "next/cache";

export type BranchListItem = {
  id: string;
  name: string;
  isDefault: boolean;
};

async function assertOwnership(conversationId: string) {
  const user = await requireUser();
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  });
  if (!conversation) throw new Error("Conversation not found");
  return conversation;
}

export async function listBranches(conversationId: string): Promise<BranchListItem[]> {
  await assertOwnership(conversationId);
  return prisma.branch.findMany({
    where: { conversationId, deletedAt: null },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      name: true,
      isDefault: true,
    },
  });
}

export async function createBranch(conversationId: string, fromMessageId: string, name?: string) {
  await assertOwnership(conversationId);

  const forkMessage = await prisma.message.findFirstOrThrow({
    where: { id: fromMessageId, conversationId },
  });

  const branch = await prisma.branch.create({
    data: {
      conversationId,
      name: name ?? `Branch from "${forkMessage.content.slice(0, 30)}"`,
      forkedFromId: forkMessage.branchId,
      forkMessageId: forkMessage.id,
      headMessageId: forkMessage.id,
    },
  });

  revalidatePath(`/c/${conversationId}`);
  return branch;
}

export async function renameBranch(branchId: string, name: string) {
  const branch = await prisma.branch.findUniqueOrThrow({ where: { id: branchId } });
  await assertOwnership(branch.conversationId);
  await prisma.branch.update({ where: { id: branchId }, data: { name } });
  revalidatePath(`/c/${branch.conversationId}`);
}

export async function deleteBranch(branchId: string) {
  const branch = await prisma.branch.findUniqueOrThrow({ where: { id: branchId } });
  await assertOwnership(branch.conversationId);

  if (branch.isDefault) throw new Error("Cannot delete the default branch");

  const childCount = await prisma.branch.count({
    where: { forkedFromId: branchId, deletedAt: null },
  });
  if (childCount > 0) throw new Error("Delete or reassign child branches first");

  await prisma.branch.update({ where: { id: branchId }, data: { deletedAt: new Date() } });
  revalidatePath(`/c/${branch.conversationId}`);
}