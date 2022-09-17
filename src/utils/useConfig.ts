import type { Config } from "./types"
import { useLocalStorage } from "./useLocalStorage"

export const defaultFormValues: Config = {
    owner: "",
    repos: "",
    githubAuthToken: ""
}

export const useConfig = () => useLocalStorage<Config>("config", defaultFormValues)