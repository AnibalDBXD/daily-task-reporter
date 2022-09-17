import { useState } from "preact/hooks";
import { redirect } from "../utils/redirect";
import type { Config } from "../utils/types";
import { useLocalStorage } from "../utils/useLocalStorage";
import { Button } from "./Button";
import { Input } from "./Input";

const defaultFormValues: Config = {
    owner: "",
    repos: "",
    userName: ""
}

export const Form = () => {
    const [config, setConfig] = useLocalStorage<Config>("config", defaultFormValues);

    const [owner, setOwner] = useState(config.owner);
    const [repos, setRepos] = useState(config.repos);
    const [userName, setUserName] = useState(config.userName);

    const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const { name, value } = target;

        if (name === "owner") setOwner(value);
        if (name === "repos") setRepos(value);
        if (name === "userName") setUserName(value);
    }

    const handleSubmit = (event: Event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData);
        setConfig(data as Config);
        redirect("/")
    }

  return (
      <form onSubmit={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex flex-col">
              <div className="mt-4">
                  <Input label="Owner" type="text" value={owner} onChange={handleChange} name="owner" id="owner" defaultValue={config.owner} />
              </div>
              <div className="mt-4">
                  <Input label="Repos" type="text" value={repos} onChange={handleChange} name="repos" id="repos" defaultValue={config.repos} />
              </div>
              <div className="mt-4">
                  <Input label="Github user name" type="text" value={userName} onChange={handleChange} name="userName" id="userName" defaultValue={config.userName} />
              </div>
              <Button type="submit" className="mt-6">Submit</Button>
          </div>
    </form>
  )
}