import { useState } from "preact/hooks";
import { redirect } from "../utils/redirect";
import type { Config } from "../utils/types";
import { useConfig } from "../utils/useConfig";
import { Button } from "./Button";
import { Input } from "./Input";

export const Form = () => {
    const [config, setConfig] = useConfig();

    const [owner, setOwner] = useState(config.owner);
    const [repos, setRepos] = useState(config.repos);
    const [githubAuthToken, setGithubAuthToken] = useState(config.githubAuthToken);

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;

        if (name === "owner") setOwner(value);
        if (name === "repos") setRepos(value);
        if (name === "githubAuthToken") setGithubAuthToken(value);
    }

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        setConfig(data as Config);
        redirect("/")
    }

  return (
      <form onSubmit={handleSubmit} class="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-col">
              <div className="mt-4">
                  <Input label="Owner - Repositories owner" type="text" value={owner} onChange={handleChange} name="owner" id="owner" defaultValue={config.owner} />
              </div>
              <div className="mt-4">
                  <Input label="Repos - Repositories name" type="text" value={repos} onChange={handleChange} name="repos" id="repos" defaultValue={config.repos} />
              </div>
              <div className="mt-4">
                  <Input label="Github auth token" type="text" value={githubAuthToken} onChange={handleChange} name="githubAuthToken" id="githubAuthToken" defaultValue={config.githubAuthToken} />
                  <a class="text-cyan-600 mt-4" href="https://docs.github.com/en/rest/quickstart">More info</a>
              </div>
              <p class="text-xs mt-2 text-gray-500">This data will be saved in the local storage</p>
              <Button type="submit" className="mt-6">Submit</Button>
          </div>
    </form>
  )
}