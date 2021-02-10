import { Endpoint } from "../../Endpoint"
import { Postgres } from "../../wrapper/Postgres"
import { QueryResult } from "pg"

class UsernameExists extends Endpoint {
    protected async post(): Promise<void> {
        try {
            const username = this.getParameters()

            this.rowsAffected = await Postgres.query(
                "SELECT username FROM login WHERE username = $1::text",
                [username],
                (queryResult: QueryResult): void => {
                    this.response = JSON.stringify({
                        usernameExists: this.parseResult(queryResult, username),
                    })
                }
            )
        } catch (error) {
            this.response = JSON.stringify({
                error: error,
                usernameExists: true,
            })
        }
    }

    private parseResult(queryResult: QueryResult, username: string): boolean {
        try {
            return queryResult.rows[0].username === username
        } catch {
            return false
        }
    }
}

export { UsernameExists, UsernameExists as Endpoint }
