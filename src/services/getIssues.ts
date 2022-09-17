import { octokit } from "./octokit";

interface Config {
    owner: string;
    repo: string;
};

export const getIssues = async (issue_numbers: string[], config: Config) => {
    const issue_urlsPromise = issue_numbers.map(async (issueNumber) => {
        const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
            ...config,
            issue_number: Number(issueNumber.replace('#', ''))
        });
        return response.data.html_url;
    })
    const issue_urls = await Promise.all(issue_urlsPromise);
    return issue_urls;
}