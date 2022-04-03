import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"

export class Account {
    async usernameExists({ username }: { username: string }): Promise<boolean> {
        let exists = false

        await Postgres.query({
            sql: "SELECT username FROM login WHERE username = $1::text",
            useResults: ({
                queryResult,
            }: {
                queryResult: QueryResult
            }): void => {
                exists = this.parseResult({
                    queryResult,
                    username,
                })
            },
            values: [username],
        })

        return exists
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
