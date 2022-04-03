import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"

export class Database {
    async isWorking(): Promise<boolean> {
        const message = "Postgres is working."

        let output = false

        try {
            await Postgres.query({
                sql: "SELECT $1::text AS message",
                useResults: ({
                    queryResult,
                }: {
                    queryResult: QueryResult
                }): void => {
                    output = queryResult.rows[0].message === message
                },
                values: [message],
            })
        } catch (error) {} // eslint-disable-line no-empty

        return output
    }
}