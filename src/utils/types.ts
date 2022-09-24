export interface Config {
    owner?: string;
    repos?: string;
    githubAuthToken?: string;
}

export interface Report {
    repo: string;
    title: string;
    pullRequestUrl: string;
    issuesUrls: string[];
    updated_at: string;
}