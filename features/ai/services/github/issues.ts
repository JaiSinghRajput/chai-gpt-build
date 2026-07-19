import { github } from "./client";
import type {
  GetIssueInput,
  ListIssuesInput,
} from "./types";

export async function listIssues({
  owner,
  repo,
  state = "open",
  page = 1,
  perPage = 30,
}: ListIssuesInput) {
  const { data } = await github.rest.issues.listForRepo({
    owner,
    repo,
    state,
    page,
    per_page: perPage,
  });

  return data.map((issue) => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    locked: issue.locked,

    author: {
      login: issue.user?.login,
      avatarUrl: issue.user?.avatar_url,
      profileUrl: issue.user?.html_url,
    },

    labels: issue.labels.map((label) =>
      typeof label === "string"
        ? label
        : {
            name: label.name,
            color: label.color,
            description: label.description,
          },
    ),

    comments: issue.comments,

    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    closedAt: issue.closed_at,

    url: issue.html_url,
  }));
}

export async function getIssue({
  owner,
  repo,
  issueNumber,
}: GetIssueInput) {
  const { data } = await github.rest.issues.get({
    owner,
    repo,
    issue_number: issueNumber,
  });

  return {
    number: data.number,
    title: data.title,
    body: data.body,

    state: data.state,
    locked: data.locked,

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

    labels: data.labels.map((label) =>
      typeof label === "string"
        ? label
        : {
            name: label.name,
            color: label.color,
            description: label.description,
          },
    ),

    comments: data.comments,

    createdAt: data.created_at,
    updatedAt: data.updated_at,
    closedAt: data.closed_at,

    url: data.html_url,
  };
}

export const githubIssuesService = {
  listIssues,
  getIssue,
};