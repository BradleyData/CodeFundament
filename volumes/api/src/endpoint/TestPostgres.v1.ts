import { Endpoint } from "../Endpoint"
import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"

class TestPostgres extends Endpoint {
    protected async get(): Promise<void> {
        try {
            const message = "Postgres is working."

            this.rowsAffected = await Postgres.query({
                sql: "SELECT $1::text AS message",
                useResults: ({
                    queryResult,
                }: {
                    queryResult: QueryResult
                }): void => {
                    const connection = queryResult.rows[0].message === message
                    this.response = JSON.stringify({ postgres: connection })
                },
                values: [message],
            })
        } catch (error) {
            this.returnError({ error, output: { postgres: false } })
        }
    }
}

export { TestPostgres, TestPostgres as Endpoint }
