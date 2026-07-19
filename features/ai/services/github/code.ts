import { github } from "./client";
import type { GetFileInput } from "./types";

export async function getFile({
  owner,
  repo,
  path,
  ref,
}: GetFileInput) {
  const { data } = await github.rest.repos.getContent({
    owner,
    repo,
    path,
    ref,
  });

  if (Array.isArray(data)) {
    throw new Error("The requested path is a directory.");
  }

  if (data.type !== "file") {
    throw new Error(`The requested path is a ${data.type}, not a file.`);
  }

  const content =
    data.encoding === "base64"
      ? Buffer.from(data.content, "base64").toString("utf-8")
      : data.content;

  return {
    name: data.name,
    path: data.path,
    sha: data.sha,
    size: data.size,
    content,
    encoding: "utf-8",
    downloadUrl: data.download_url,
    htmlUrl: data.html_url,
  };
}

export const githubCodeService = {
  getFile,
};