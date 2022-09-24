import { getIssues } from './../services/getIssues';
import { getUserPullRequests } from "../services/getUserPullRequests";
import { createOctokitFetcher, Fetcher } from "../services/octokit";
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

  let fetcher: Fetcher | null, name: string | null = null;
  try {
    const { fetcher: newFetcher, name: newName } = await createOctokitFetcher({ owner, githubAuthToken });
    fetcher = newFetcher;
    name = newName;
  } catch (error) {
    return (
      new Response(JSON.stringify({
         error: (error as { response: { data: { message: string }}}).response.data.message,
      }), {
        status: 400
      }
    ))
  }
  if (!fetcher || !name) {
    return (
      new Response(JSON.stringify({
        error: "Something went wrong",
      }), {
        status: 500
      }
    ))
  }

  const data = {
    repos: repos.split(" "),
    userName: name
  };

  const pullRequests = (await getUserPullRequests(fetcher, data)).flat(1);

  const pullRequestsWithIssueLinksPromise = pullRequests.map(async (pullRequest) => {
    const { issuesNumber, repo } = pullRequest;
    if (!fetcher) return pullRequest;
    const issuesUrls = issuesNumber?.length ? await getIssues(fetcher, { issuesNumber, repo }) : [];

    return {
      ...pullRequest,
      issuesUrls
    }
  });

  const pullRequestsWithIssueLinks = await Promise.all(pullRequestsWithIssueLinksPromise);

  return new Response(JSON.stringify(pullRequestsWithIssueLinks), {
    status: 200
  });
}