import { Endpoint } from "../../Endpoint"
import { Postgres } from "../../wrapper/Postgres"
import { QueryResult } from "pg"

class UsernameExists extends Endpoint {
    protected async get(): Promise<void> {
        try {
            this.rowsAffected = await Postgres.query({
                sql: "SELECT username FROM login WHERE username = $1::text",
                useResults: ({
                    queryResult,
                }: {
                    queryResult: QueryResult
                }): void => {
                    this.response = JSON.stringify({
                        usernameExists: this.parseResult({
                            queryResult,
                            username: this.parameters.username,
                        }),
                    })
                },
                values: [this.parameters.username],
            })
        } catch (error) {
            this.returnError({ error, output: { usernameExists: true } })
        }
    }

    private parseResult({
        queryResult,
        username,
    }: {
        queryResult: QueryResult
        username: string
    }): boolean {
        try {
            return queryResult.rows[0].username === username
        } catch {
            return false
        }
    }
}

export { UsernameExists, UsernameExists as Endpoint }
