export interface CreateMemoryInput {
  userId: string;
  key: string;
  value: string;
  type?: "PREFERENCE" | "PROFILE" | "PROJECT" | "CUSTOM";
}

export interface GetMemoryInput {
  userId: string;
  key: string;
}

export interface ListMemoriesInput {
  userId: string;
}

export interface SearchMemoriesInput {
  userId: string;
  query: string;
}

export interface UpdateMemoryInput {
  userId: string;
  key: string;
  value: string;
}

export interface DeleteMemoryInput {
  userId: string;
  key: string;
}