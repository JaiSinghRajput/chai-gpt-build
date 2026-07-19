import { github } from "./client";
import { GetRepositoryInput, ListBranchesInput, ListContributorsInput, ListLanguagesInput, ListReleasesInput, ListTagsInput, SearchRepositoriesInput } from "./types";


export async function searchRepositories({
  query,
  page = 1,
  perPage = 10,
}: SearchRepositoriesInput) {
  const { data } = await github.rest.search.repos({
    q: query,
    page,
    per_page: perPage,
    sort: "stars",
    order: "desc",
  });

  return {
    totalCount: data.total_count,
    incompleteResults: data.incomplete_results,

    repositories: data.items.map((repo) => ({
      id: repo.id,

      name: repo.name,

      fullName: repo.full_name,

      description: repo.description,

      owner: repo?.owner?.login,

      url: repo.html_url,

      language: repo.language,

      stars: repo.stargazers_count,

      forks: repo.forks_count,

      openIssues: repo.open_issues_count,

      defaultBranch: repo.default_branch,

      topics: repo.topics,

      archived: repo.archived,

      visibility: repo.visibility,

      updatedAt: repo.updated_at,
    })),
  };
}


export async function getRepository({
  owner,
  repo,
}: GetRepositoryInput) {
  const { data } = await github.rest.repos.get({
    owner,
    repo,
  });

  return {
    id: data.id,

    name: data.name,

    fullName: data.full_name,

    owner: {
      login: data.owner.login,
      avatarUrl: data.owner.avatar_url,
      profileUrl: data.owner.html_url,
    },

    description: data.description,

    homepage: data.homepage,

    url: data.html_url,

    defaultBranch: data.default_branch,

    language: data.language,

    languagesUrl: data.languages_url,

    topics: data.topics,

    visibility: data.visibility,

    license: data.license
      ? {
          key: data.license.key,
          name: data.license.name,
        }
      : null,

    stars: data.stargazers_count,

    watchers: data.watchers_count,

    forks: data.forks_count,

    openIssues: data.open_issues_count,

    size: data.size,

    archived: data.archived,

    disabled: data.disabled,

    hasIssues: data.has_issues,

    hasWiki: data.has_wiki,

    hasProjects: data.has_projects,

    hasDiscussions: data.has_discussions,

    hasDownloads: data.has_downloads,

    createdAt: data.created_at,

    updatedAt: data.updated_at,

    pushedAt: data.pushed_at,
  };
}

export async function getReadme({
  owner,
  repo,
}: GetRepositoryInput) {
  const { data } = await github.rest.repos.getReadme({
    owner,
    repo,
    mediaType: {
      format: "raw",
    },
  });

  return {
    owner,
    repo,
    content: data as unknown as string,
  };
}

export async function listBranches({
  owner,
  repo,
  page = 1,
  perPage = 30,
}: ListBranchesInput) {
  const { data } = await github.rest.repos.listBranches({
    owner,
    repo,
    page,
    per_page: perPage,
  });

  return data.map((branch) => ({
    name: branch.name,
    isProtected: branch.protected,
    commit: {
      sha: branch.commit.sha,
      url: branch.commit.url,
    },
  }));
}

export async function listTags({
  owner,
  repo,
  page = 1,
  perPage = 30,
}: ListTagsInput) {
  const { data } = await github.rest.repos.listTags({
    owner,
    repo,
    page,
    per_page: perPage,
  });

  return data.map((tag) => ({
    name: tag.name,
    commit: {
      sha: tag.commit.sha,
      url: tag.commit.url,
    },
    zipballUrl: tag.zipball_url,
    tarballUrl: tag.tarball_url,
  }));
}

export async function listLanguages({
  owner,
  repo,
}: ListLanguagesInput) {
  const { data } = await github.rest.repos.listLanguages({
    owner,
    repo,
  });

  const totalBytes = Object.values(data).reduce(
    (sum, bytes) => sum + bytes,
    0,
  );

  return Object.entries(data)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage:
        totalBytes === 0
          ? 0
          : Number(((bytes / totalBytes) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export async function listContributors({
  owner,
  repo,
  page = 1,
  perPage = 30,
}: ListContributorsInput) {
  const { data } = await github.rest.repos.listContributors({
    owner,
    repo,
    page,
    per_page: perPage,
  });

  return data.map((contributor) => ({
    id: contributor.id,
    login: contributor.login,
    avatarUrl: contributor.avatar_url,
    profileUrl: contributor.html_url,
    contributions: contributor.contributions,
    type: contributor.type,
    isSiteAdmin: contributor.site_admin,
  }));
}

export async function listReleases({
  owner,
  repo,
  page = 1,
  perPage = 30,
}: ListReleasesInput) {
  const { data } = await github.rest.repos.listReleases({
    owner,
    repo,
    page,
    per_page: perPage,
  });

  return data.map((release) => ({
    id: release.id,
    tagName: release.tag_name,
    name: release.name,
    body: release.body,
    url: release.html_url,
    draft: release.draft,
    prerelease: release.prerelease,
    author: {
      login: release.author?.login,
      avatarUrl: release.author?.avatar_url,
      profileUrl: release.author?.html_url,
    },
    createdAt: release.created_at,
    publishedAt: release.published_at,
    assets: release.assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      size: asset.size,
      downloadCount: asset.download_count,
      contentType: asset.content_type,
      browserDownloadUrl: asset.browser_download_url,
    })),
  }));
}

export const githubRepositoriesService = {
    searchRepositories,
    getRepository,
    getReadme,
    listBranches,
    listTags,
    listLanguages,
    listContributors,
    listReleases,
}
