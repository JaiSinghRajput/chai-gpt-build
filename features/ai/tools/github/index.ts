import { tool } from "ai";
import { z } from "zod";

import {
    githubCodeService,
    githubIssuesService,
    githubPullRequestsService,
    githubRepositoriesService,
    githubUsersService,
} from "../../services/github";

const inputSchema = z.discriminatedUnion("action", [
    z.object({
        action: z.literal("searchRepositories"),
        query: z.string(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("getRepository"),
        owner: z.string(),
        repo: z.string(),
    }),

    z.object({
        action: z.literal("getReadme"),
        owner: z.string(),
        repo: z.string(),
    }),

    z.object({
        action: z.literal("listBranches"),
        owner: z.string(),
        repo: z.string(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("listTags"),
        owner: z.string(),
        repo: z.string(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("listLanguages"),
        owner: z.string(),
        repo: z.string(),
    }),

    z.object({
        action: z.literal("listContributors"),
        owner: z.string(),
        repo: z.string(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("listReleases"),
        owner: z.string(),
        repo: z.string(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("searchUsers"),
        query: z.string(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("getUser"),
        username: z.string(),
    }),

    z.object({
        action: z.literal("getFile"),
        owner: z.string(),
        repo: z.string(),
        path: z.string(),
        ref: z.string().optional(),
    }),

    z.object({
        action: z.literal("listIssues"),
        owner: z.string(),
        repo: z.string(),
        state: z.enum(["open", "closed", "all"]).optional(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("getIssue"),
        owner: z.string(),
        repo: z.string(),
        issueNumber: z.number().int().positive(),
    }),

    z.object({
        action: z.literal("listPullRequests"),
        owner: z.string(),
        repo: z.string(),
        state: z.enum(["open", "closed", "all"]).optional(),
        page: z.number().int().positive().optional(),
        perPage: z.number().int().positive().max(100).optional(),
    }),

    z.object({
        action: z.literal("getPullRequest"),
        owner: z.string(),
        repo: z.string(),
        pullNumber: z.number().int().positive(),
    }),
]);

export function createGithubTool() {
    return tool({
        description: `
Interact with public GitHub repositories.

Use this tool whenever the user wants to:

- search repositories
- inspect repositories
- read repository README files
- inspect branches
- inspect tags
- inspect languages
- inspect contributors
- inspect releases

Use this tool instead of answering from memory.
`,

        inputSchema,

        async execute(input) {
            switch (input.action) {
                case "searchRepositories":
                    return githubRepositoriesService.searchRepositories({
                        query: input.query,
                        page: input.page,
                        perPage: input.perPage,
                    });

                case "getRepository":
                    return githubRepositoriesService.getRepository({
                        owner: input.owner,
                        repo: input.repo,
                    });

                case "getReadme":
                    return githubRepositoriesService.getReadme({
                        owner: input.owner,
                        repo: input.repo,
                    });

                case "listBranches":
                    return githubRepositoriesService.listBranches({
                        owner: input.owner,
                        repo: input.repo,
                        page: input.page,
                        perPage: input.perPage,
                    });

                case "listTags":
                    return githubRepositoriesService.listTags({
                        owner: input.owner,
                        repo: input.repo,
                        page: input.page,
                        perPage: input.perPage,
                    });

                case "listLanguages":
                    return githubRepositoriesService.listLanguages({
                        owner: input.owner,
                        repo: input.repo,
                    });

                case "listContributors":
                    return githubRepositoriesService.listContributors({
                        owner: input.owner,
                        repo: input.repo,
                        page: input.page,
                        perPage: input.perPage,
                    });

                case "listReleases":
                    return githubRepositoriesService.listReleases({
                        owner: input.owner,
                        repo: input.repo,
                        page: input.page,
                        perPage: input.perPage,
                    });
                case "searchUsers":
                    return githubUsersService.searchUsers({
                        query: input.query,
                        page: input.page,
                        perPage: input.perPage,
                    });

                case "getUser":
                    return githubUsersService.getUser({
                        username: input.username,
                    });

                case "getFile":
                    return githubCodeService.getFile({
                        owner: input.owner,
                        repo: input.repo,
                        path: input.path,
                        ref: input.ref,
                    });

                case "listIssues":
                    return githubIssuesService.listIssues({
                        owner: input.owner,
                        repo: input.repo,
                        state: input.state,
                        page: input.page,
                        perPage: input.perPage,
                    });

                case "getIssue":
                    return githubIssuesService.getIssue({
                        owner: input.owner,
                        repo: input.repo,
                        issueNumber: input.issueNumber,
                    });

                case "listPullRequests":
                    return githubPullRequestsService.listPullRequests({
                        owner: input.owner,
                        repo: input.repo,
                        state: input.state,
                        page: input.page,
                        perPage: input.perPage,
                    });

                case "getPullRequest":
                    return githubPullRequestsService.getPullRequest({
                        owner: input.owner,
                        repo: input.repo,
                        pullNumber: input.pullNumber,
                    });
            }
        },
    });
}