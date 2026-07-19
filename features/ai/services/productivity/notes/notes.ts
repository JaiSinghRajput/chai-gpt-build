import { prisma } from "@/lib/db";
import { ArchiveNoteInput, CreateNoteInput, DeleteNoteInput, GetNoteInput, ListNotesInput, PinNoteInput, SearchNotesInput, UpdateNoteInput } from "./types";

export async function createNote(input: CreateNoteInput) {
  return prisma.note.create({
    data: {
      userId: input.userId,
      conversationId: input.conversationId,
      title: input.title.trim(),
      content: input.content.trim(),
      summary: input.summary,
      tags: input.tags ?? [],
    },
  });
}

export async function listNotes({
  userId,
  includeArchived = false,
  pinnedOnly = false,
}: ListNotesInput) {
  return prisma.note.findMany({
    where: {
      userId,
      ...(includeArchived
        ? {}
        : {
            status: "ACTIVE",
          }),
      ...(pinnedOnly
        ? {
            isPinned: true,
          }
        : {}),
    },
    orderBy: [
      {
        isPinned: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });
}


export async function searchNotes({
  userId,
  query,
  includeArchived = false,
}: SearchNotesInput) {
  return prisma.note.findMany({
    where: {
      userId,
      ...(includeArchived ? {} : { status: "ACTIVE" }),
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: [
      {
        isPinned: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  });
}

export async function updateNote({
  userId,
  id,
  title,
  content,
  summary,
  tags,
}: UpdateNoteInput) {
  return prisma.note.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      ...(title !== undefined && {
        title: title.trim(),
      }),
      ...(content !== undefined && {
        content: content.trim(),
      }),
      ...(summary !== undefined && {
        summary,
      }),
      ...(tags !== undefined && {
        tags,
      }),
    },
  });
}
export async function getNote({
  userId,
  id,
}: GetNoteInput) {
  return prisma.note.findFirst({
    where: {
      id,
      userId,
    },
  });
}


export async function deleteNote({
  userId,
  id,
}: DeleteNoteInput) {
  return prisma.note.deleteMany({
    where: {
      id,
      userId,
    },
  });
}

export async function pinNote({
  userId,
  id,
  pinned,
}: PinNoteInput) {
  return prisma.note.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      isPinned: pinned,
    },
  });
}

export async function archiveNote({
  userId,
  id,
  archived,
}: ArchiveNoteInput) {
  return prisma.note.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      status: archived
        ? "ARCHIVED"
        : "ACTIVE",
    },
  });
}

export const notesService = {
  createNote,
  getNote,
  listNotes,
  searchNotes,
  updateNote,
  deleteNote,
  pinNote,
  archiveNote,
};