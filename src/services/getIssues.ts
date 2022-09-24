import type { Fetcher } from "./octokit";
import type { Endpoints } from "@octokit/types";

const URL_TO_FETCH = "GET /repos/{owner}/{repo}/issues/{issue_number}"

type ListIssuesReposResponse = Endpoints[typeof URL_TO_FETCH]["response"]["data"];

interface Config {
    repo: string;
    issuesNumber: string[]
}

export const getIssues = async (fetcher: Fetcher, { issuesNumber, repo }: Config) => {
    const issue_urlsPromise = issuesNumber.map(async (issueNumber) => {
        const response: ListIssuesReposResponse = await fetcher(URL_TO_FETCH, {
            repo,
            issue_number: Number(issueNumber.replace('#', ''))
        });
        return response.html_url;
    })
    const issue_urls = await Promise.all(issue_urlsPromise);
    return issue_urls;
}