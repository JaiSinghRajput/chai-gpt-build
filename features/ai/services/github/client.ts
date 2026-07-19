// features/ai/services/github/client.ts

import { Octokit } from "octokit";

export const github = new Octokit({
  userAgent: "MentorMirror/1.0",
});