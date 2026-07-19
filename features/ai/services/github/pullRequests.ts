import { github } from "./client";
import type {
  GetPullRequestInput,
  ListPullRequestsInput,
} from "./types";

export async function listPullRequests({
  owner,
  repo,
  state = "open",
  page = 1,
  perPage = 30,
}: ListPullRequestsInput) {
  const { data } = await github.rest.pulls.list({
    owner,
    repo,
    state,
    page,
    per_page: perPage,
  });

return data.map((pr) => ({
  number: pr.number,
  title: pr.title,
  body: pr.body,

  state: pr.state,
  draft: pr.draft,
  merged: pr.merged_at !== null,

  author: {
    login: pr.user?.login,
    avatarUrl: pr.user?.avatar_url,
    profileUrl: pr.user?.html_url,
  },

  head: {
    ref: pr.head.ref,
    sha: pr.head.sha,
  },

  base: {
    ref: pr.base.ref,
    sha: pr.base.sha,
  },

  createdAt: pr.created_at,
  updatedAt: pr.updated_at,
  closedAt: pr.closed_at,
  mergedAt: pr.merged_at,

  url: pr.html_url,
}));
}

export async function getPullRequest({
  owner,
  repo,
  pullNumber,
}: GetPullRequestInput) {
  const { data } = await github.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });

  return {
    number: data.number,
    title: data.title,
    body: data.body,

    state: data.state,
    draft: data.draft,
    merged: data.merged,

    author: {
      login: data.user?.login,
      avatarUrl: data.user?.avatar_url,
      profileUrl: data.user?.html_url,
    },

    assignees: data.assignees?.map((assignee) => ({
      login: assignee.login,
      avatarUrl: assignee.avatar_url,
      profileUrl: assignee.html_url,
    })),

    requestedReviewers: data.requested_reviewers?.map((reviewer) => ({
      login: reviewer.login,
      avatarUrl: reviewer.avatar_url,
      profileUrl: reviewer.html_url,
    })),

    labels: data.labels.map((label) => ({
      name: label.name,
      color: label.color,
      description: label.description,
    })),

    head: {
      ref: data.head.ref,
      sha: data.head.sha,
    },

    base: {
      ref: data.base.ref,
      sha: data.base.sha,
    },

    comments: data.comments,
    reviewComments: data.review_comments,
    commits: data.commits,
    additions: data.additions,
    deletions: data.deletions,
    changedFiles: data.changed_files,

    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,
    mergedAt: data.merged_at,

    url: data.html_url,
  };
}

export const githubPullRequestsService = {
  listPullRequests,
  getPullRequest,
};