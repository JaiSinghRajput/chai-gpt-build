import { prisma } from "@/lib/db";
import { CreateMemoryInput, DeleteMemoryInput, GetMemoryInput, ListMemoriesInput, SearchMemoriesInput, UpdateMemoryInput } from "./types";

export async function remember({
  userId,
  key,
  value,
  type = "CUSTOM",
}: CreateMemoryInput) {
  return prisma.memory.upsert({
    where: {
      userId_key: {
        userId,
        key,
      },
    },
    update: {
      value,
      type,
    },
    create: {
      userId,
      key,
      value,
      type,
    },
  });
}

export async function recall({
  userId,
  key,
}: GetMemoryInput) {
  return prisma.memory.findFirst({
    where: {
      userId,
      key,
    },
  });
}

export async function recallAll({
  userId,
}: ListMemoriesInput) {
  return prisma.memory.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function search({
  userId,
  query,
}: SearchMemoriesInput) {
  return prisma.memory.findMany({
    where: {
      userId,
      OR: [
        {
          key: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          value: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function update({
  userId,
  key,
  value,
}: UpdateMemoryInput) {
  return prisma.memory.updateMany({
    where: {
      userId,
      key,
    },
    data: {
      value,
    },
  });
}

export async function forget({
  userId,
  key,
}: DeleteMemoryInput) {
  return prisma.memory.deleteMany({
    where: {
      userId,
      key,
    },
  });
}

export const memoryService = {
  remember,
  recall,
  recallAll,
  search,
  update,
  forget,
};