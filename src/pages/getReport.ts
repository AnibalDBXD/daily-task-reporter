import { getUserPullRequests } from "../services/getUserPullRequests";
import type { Config } from "../utils/types";

export async function post({ request }: { request: Request}) {
  const { owner, repos, userName }: Config = await request.json();
  if (!owner || !repos || !userName) {
    return (
      new Response(JSON.stringify({
        error: "Missing required parameters",
      }), {
        status: 400
      }
      )
    )
  }

  const pullRequestsData = await (await getUserPullRequests(owner, repos.split(" "), userName)).flat(1);

    return new Response(JSON.stringify(pullRequestsData), {
      status: 200
    });
  }