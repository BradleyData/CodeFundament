import { Endpoint } from "../Endpoint"
import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"

class TestPostgres extends Endpoint {
    protected async get(): Promise<void> {
        try {
            const message = "Postgres is working."

            this.rowsAffected = await Postgres.query(
                "SELECT $1::text AS message",
                [message],
                (queryResult: QueryResult): void => {
                    const connection = queryResult.rows[0].message === message
                    this.response = JSON.stringify({ postgres: connection })
                }
            )
        } catch (error) {
            this.response = JSON.stringify({ error: error, postgres: false })
        }
    }
}

export { TestPostgres, TestPostgres as Endpoint }
