import { Octokit } from "octokit";
import type { RequestParameters } from "@octokit/types";
import type { Config } from "../utils/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Fetcher = (url: string, options: RequestParameters) => Promise<any>;

export const createOctokitFetcher = async ({ owner, githubAuthToken }: Config) => {
  const octokit = new Octokit({
    auth: githubAuthToken,
  });

  const fetcher = async (url: string, options: RequestParameters) => {
        const response = await octokit.request(url, {
            ...options,
            owner,
        });
        return response.data;
    }

  const name = (await octokit.rest.users.getAuthenticated()).data.login;

  return {
      fetcher,
      name
  }
}