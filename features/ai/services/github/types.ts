export interface SearchRepositoriesInput {
  query: string;
  page?: number;
  perPage?: number;
}

export interface GetRepositoryInput {
  owner: string;
  repo: string;
}

export interface GetReadmeInput {
  owner: string;
  repo: string;
}

export interface GetFileInput {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
}

export interface ListBranchesInput {
  owner: string;
  repo: string;
  page?: number;
  perPage?: number;
}

export interface ListTagsInput {
  owner: string;
  repo: string;
  page?: number;
  perPage?: number;
}

export interface ListLanguagesInput {
  owner: string;
  repo: string;
}

export interface ListContributorsInput {
  owner: string;
  repo: string;
  page?: number;
  perPage?: number;
}

export interface ListReleasesInput {
  owner: string;
  repo: string;
  page?: number;
  perPage?: number;
}

export interface SearchUsersInput {
  query: string;
  page?: number;
  perPage?: number;
}

export interface GetUserInput {
  username: string;
}

export interface ListIssuesInput {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  page?: number;
  perPage?: number;
}

export interface GetIssueInput {
  owner: string;
  repo: string;
  issueNumber: number;
}

export interface ListPullRequestsInput {
  owner: string;
  repo: string;
  state?: "open" | "closed" | "all";
  page?: number;
  perPage?: number;
}

export interface GetPullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
}