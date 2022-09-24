import { getIssues } from './../services/getIssues';
import { getUserPullRequests } from "../services/getUserPullRequests";
import { createOctokitFetcher, Fetcher } from "../services/octokit";
import type { Config, VIEW } from "../utils/types";

interface FormRequest extends Config {
  view: VIEW;
  date: string;
}

export async function post({ request }: { request: Request}) {
  const { owner, repos, githubAuthToken, view, date }: FormRequest = await request.json();
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
    userName: name,
    view,
    date
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

  const sortedPullRequests = pullRequestsWithIssueLinks.sort((a, b) => {
    const aDate = new Date(a.updated_at);
    const bDate = new Date(b.updated_at);
    return aDate.getTime() - bDate.getTime();
  });

  return new Response(JSON.stringify(sortedPullRequests), {
    status: 200
  });
}