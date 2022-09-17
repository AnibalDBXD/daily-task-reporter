import { OWNER, REPOS } from "../constant";
import { getUserPullRequests } from "../services/getUserPullRequests";

export async function get() {
  const pullRequestsData = await (await getUserPullRequests(OWNER, REPOS)).flat(1);

    return new Response(JSON.stringify(pullRequestsData), {
      status: 200
    });
  }