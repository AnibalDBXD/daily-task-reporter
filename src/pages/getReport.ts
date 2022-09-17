import { getUserPullRequests } from "../services/getUserPullRequests";
import { createOctokitFetcher } from "../services/octokit";
import type { Config } from "../utils/types";

export async function post({ request }: { request: Request}) {
  const { owner, repos, githubAuthToken }: Config = await request.json();
  if (!owner || !repos || !githubAuthToken) {
    return (
      new Response(JSON.stringify({
        error: "Missing required parameters",
      }), {
        status: 400
      }
      )
    )
  }

  const { fetcher, name } = await createOctokitFetcher({ owner, githubAuthToken });

  const data = {
    repos: repos.split(" "),
    userName: name
  };

  const pullRequestsData = (await getUserPullRequests(fetcher, data)).flat(1);

  return new Response(JSON.stringify(pullRequestsData), {
    status: 200
  });
}