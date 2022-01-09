interface Query {
    id: string
    name: string
    description: string
    dataviewJSQuery?: string
}

class Query {

    constructor(name: string = "",
        description: string = "",
        id: string = "",
        dataviewJSQuery: string = null) {
        this.name = name
        this.description = description
        this.id = id
        this.dataviewJSQuery = dataviewJSQuery
    }

    static copyQuery(target: Query, source: Query) {
        target.id = source.id
        target.name = source.name
        target.description = source.description
        target.dataviewJSQuery = source.dataviewJSQuery
    }
}

export default Query