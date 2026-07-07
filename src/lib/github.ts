// Schreibt eine Datei über die GitHub-Contents-API zurück ins Repository.
// Dadurch funktioniert das Speichern auch auf der veröffentlichten (Vercel-)
// Seite: Der Commit landet in Git und löst automatisch ein neues Deployment aus.
//
// Nötige Umgebungsvariablen (in Vercel unter Project → Settings → Environment
// Variables hinterlegen):
//   GITHUB_TOKEN   – Fine-grained Personal Access Token mit "Contents: Read and
//                    write" für genau dieses Repository.
//   GITHUB_REPO    – "owner/name", Standard: janinebergi/janine-website
//   GITHUB_BRANCH  – Zielbranch, Standard: main

const DEFAULT_REPO = "janinebergi/janine-website";
const DEFAULT_BRANCH = "main";

export function isGithubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

function repoInfo() {
  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const [owner, name] = repo.split("/");
  const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
  return { owner, name, branch };
}

function apiHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "janine-website-admin",
  };
}

// Aktuelle Datei-SHA holen (nötig, um eine bestehende Datei zu aktualisieren).
async function getFileSha(path: string): Promise<string | undefined> {
  const { owner, name, branch } = repoInfo();
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, { headers: apiHeaders(), cache: "no-store" });
  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error(`GitHub (SHA lesen): ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

// Datei committen (anlegen oder aktualisieren).
export async function commitFile(
  path: string,
  content: string,
  message: string,
): Promise<void> {
  const { owner, name, branch } = repoInfo();
  const sha = await getFileSha(path);
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: apiHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch,
      sha,
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub (committen): ${res.status} ${await res.text()}`);
  }
}
