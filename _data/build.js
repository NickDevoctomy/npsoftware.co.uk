import { execFileSync } from "node:child_process";
import site from "./site.js";

// The version shown in the footer, linked to GitHub.
// Deploys pass their new v* release tag in SITE_VERSION. Other builds use the
// tag on HEAD if there is one, else the short commit hash.
function git(...args) {
  try {
    return execFileSync("git", args, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

export default function () {
  const ref = process.env.SITE_VERSION ?? "";
  const tag = ref.startsWith("v") ? ref : git("describe", "--tags", "--exact-match", "HEAD");
  if (tag) return { version: tag, version_url: `${site.repo_url}/releases/tag/${tag}` };

  const sha = process.env.GITHUB_SHA?.slice(0, 7) || git("rev-parse", "--short", "HEAD");
  if (sha) return { version: sha, version_url: `${site.repo_url}/commit/${sha}` };

  return { version: "", version_url: "" };
}
