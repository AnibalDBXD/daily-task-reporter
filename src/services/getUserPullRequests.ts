import dayjs from "dayjs";
import { FORMAT, today } from "../constant";
import { getIssues } from "./getIssues";
import { octokit } from "./octokit";

const EXCEL_DATE_FORMAT = "MMMM D";

export const getUserPullRequests = async (owner: string, repos: string[], userName: string) => {
    const allPullRequests = repos.flatMap((async (repo) => {
        const config = {
            owner,
            repo
        };

        const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
            ...config,
            state: "all",
            sort: "updated",
            direction: "desc",
        });

        const transformedData = response.data
            .filter(({ user, updated_at }) => {
                if (user) {
                    const isMyUser = (user.login.trim()) === userName;
                    const isToday = dayjs(updated_at).format(FORMAT) === today;
                    return isMyUser && isToday;
                }
                return false;
            })
            .map(async ({ title, html_url, body, updated_at }) => {
                const issuesNumber = body ? body.match(/#\d+/g) : [];
                const issuesUrls = issuesNumber ? await getIssues(issuesNumber, config) : [];
                return {
                    repo,
                    title,
                    pullRequestUrl: html_url,
                    issuesUrls,
                    updated_at: dayjs(updated_at).format(EXCEL_DATE_FORMAT)
                }
            })

        return await Promise.all(transformedData);
    }))

    return await Promise.all(allPullRequests);
}