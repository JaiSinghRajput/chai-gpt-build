import { github } from "./client";
import type { GetUserInput, SearchUsersInput } from "./types";

export async function searchUsers({
  query,
  page = 1,
  perPage = 10,
}: SearchUsersInput) {
  const { data } = await github.rest.search.users({
    q: query,
    page,
    per_page: perPage,
  });

  return {
    totalCount: data.total_count,
    incompleteResults: data.incomplete_results,
    users: data.items.map((user) => ({
      id: user.id,
      login: user.login,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      type: user.type,
      score: user.score,
    })),
  };
}

export async function getUser({
  username,
}: GetUserInput) {
  const { data } = await github.rest.users.getByUsername({
    username,
  });

  return {
    id: data.id,
    login: data.login,
    name: data.name,
    bio: data.bio,
    company: data.company,
    blog: data.blog,
    location: data.location,
    email: data.email,
    twitterUsername: data.twitter_username,

    avatarUrl: data.avatar_url,
    profileUrl: data.html_url,

    type: data.type,

    publicRepos: data.public_repos,
    publicGists: data.public_gists,

    followers: data.followers,
    following: data.following,

    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export const githubUsersService = {
  searchUsers,
  getUser,
};