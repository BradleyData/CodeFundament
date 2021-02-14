import { Endpoint } from "../../Endpoint"
import { Postgres } from "../../wrapper/Postgres"
import { QueryResult } from "pg"

class UsernameExists extends Endpoint {
    protected async get(): Promise<void> {
        try {
            const parameters = this.getParameters()

            this.rowsAffected = await Postgres.query(
                "SELECT username FROM login WHERE username = $1::text",
                [parameters.username],
                (queryResult: QueryResult): void => {
                    this.response = JSON.stringify({
                        usernameExists: this.parseResult({
                            queryResult,
                            username: parameters.username,
                        }),
                    })
                }
            )
        } catch (error) {
            this.returnError(error, { usernameExists: true })
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
