import Query from "src/queries/Query"

export interface MultiSelectSettings {
    queries: Array<Query>
}

export const DEFAULT_SETTINGS: MultiSelectSettings = {
    queries: []
}