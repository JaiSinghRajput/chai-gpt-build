export interface CreateNoteInput {
  userId: string;
  title: string;
  content: string;
  conversationId?: string;
  tags?: string[];
  summary?: string;
}

export interface ListNotesInput {
  userId: string;
  includeArchived?: boolean;
  pinnedOnly?: boolean;
}

export interface SearchNotesInput {
  userId: string;
  query: string;
  includeArchived?: boolean;
}

export interface UpdateNoteInput {
  userId: string;
  id: string;
  title?: string;
  content?: string;
  summary?: string;
  tags?: string[];
}
export interface GetNoteInput {
  userId: string;
  id: string;
}
export interface DeleteNoteInput {
  userId: string;
  id: string;
}

export interface PinNoteInput {
  userId: string;
  id: string;
  pinned: boolean;
}

export interface ArchiveNoteInput {
  userId: string;
  id: string;
  archived: boolean;
}
