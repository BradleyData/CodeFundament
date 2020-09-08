import { Pool, QueryResult } from "pg" // eslint-disable-line no-unused-vars
import Fs from "fs"

export default class Postgres {
    private static pool = new Pool({
        database: "postgres",
        host: "postgres",
        password: Fs.readFileSync("/run/secrets/POSTGRES_PASSWORD", "utf-8"),
        port: 5432,
        user: "postgres",
    })

    static async query(
        sql: string,
        values: any,
        useResults?: (queryResult: QueryResult) => void
    ): Promise<number> {
        const client = await this.pool.connect()
        const queryResult = await client.query(sql, values)
        // eslint-disable-next-line no-undefined
        if (useResults !== undefined) 
            useResults(queryResult)
        client.release()
        return queryResult.rowCount
    }

    static async end(): Promise<void> {
        await this.pool.end()
    }
}
