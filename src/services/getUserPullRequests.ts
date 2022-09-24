import dayjs from "dayjs";
import { FORMAT, today } from "../constant";
import type { Config } from "../utils/types";
import type { Endpoints } from "@octokit/types";
import type { Fetcher } from "./octokit";

const URL_TO_FETCH = "GET /repos/{owner}/{repo}/pulls"

type ListPullRequestsReposResponse = Endpoints[typeof URL_TO_FETCH]["response"]["data"];

const EXCEL_DATE_FORMAT = "MMMM D";

interface Data extends Omit<Config, 'repos'> {
    repos: string[];
    userName: string;
}

export const getUserPullRequests = async (fetcher: Fetcher, { repos, userName }: Data) => {
    if (!repos || !userName) {
        return [];
    }

    const allPullRequests = repos.flatMap((async (repo) => {
        const response: ListPullRequestsReposResponse = await fetcher(URL_TO_FETCH, {
            repo,
            state: "all",
            sort: "updated",
            direction: "desc",
        });

        const transformedData = response
            .filter(({ user, updated_at }) => {
                if (user) {
                    const isMyUser = (user.login.trim()) === userName;
                    const isToday = dayjs(updated_at).format(FORMAT) === today;
                    return isMyUser && isToday;
                }
                return false;
            })
            .map(({ title, html_url, body, updated_at }) => {
                const issuesNumber = body ? body.match(/#\d+/g) : [];
                return {
                    repo,
                    title,
                    pullRequestUrl: html_url,
                    issuesNumber: issuesNumber as string[],
                    updated_at: dayjs(updated_at).format(EXCEL_DATE_FORMAT)
                }
            })

        return transformedData;
    }))

    return await Promise.all(allPullRequests);
}