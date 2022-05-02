import * as Fs from "fs"
import { Pool, QueryResult } from "pg"

export class Postgres {
    static connectionInfo = Object.freeze({
        database: "postgres",
        host: "postgres",
        password: Fs.readFileSync("/run/secrets/POSTGRES_PASSWORD", "utf-8"),
        port: 5432,
        user: "postgres",
    })

    private static pool = new Pool(Postgres.connectionInfo)

    static async query({
        sql,
        useResults,
        values = [],
    }: {
        sql: string
        // eslint-disable-next-line no-unused-vars
        useResults?: ({ queryResult }: { queryResult: QueryResult }) => void
        values?: any
    }): Promise<number> {
        let client
        try {
            client = await this.pool.connect()
        } catch (error) {
            console.log("Unable to connect to database.")
            console.log(error)
            return 0
        }
        const queryResult = await client.query(sql, values)
        // eslint-disable-next-line no-undefined
        if (useResults !== undefined) 
            useResults({ queryResult })
        client.release()
        return queryResult.rowCount
    }

    static async end(): Promise<void> {
        await this.pool.end()
    }

    static async resetPool(): Promise<void> {
        try {
            await Postgres.pool.end()
        } catch {} // eslint-disable-line no-empty
        Postgres.pool = new Pool(Postgres.connectionInfo)
    }
}
