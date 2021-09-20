import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { Crypto } from "../../wrapper/Crypto"
import { DefaultFalse } from "../../type/DefaultFalse"
import { Postgres } from "../../wrapper/Postgres"
import { QueryResult } from "pg"

@Resolver()
export class Account {
    @Query((returns) => Boolean)
    async UsernameExists(@Arg("username") username: string): Promise<boolean> {
        const exists = new DefaultFalse()

        await Postgres.query({
            sql: "SELECT username FROM login WHERE username = $1::text",
            useResults: ({
                queryResult,
            }: {
                queryResult: QueryResult
            }): void => {
                exists.value = this.parseResult({
                    queryResult,
                    username,
                })
            },
            values: [username],
        })

        return exists.value
    }

    @Mutation((returns) => Boolean)
    async Create(@Arg("username") username: string): Promise<boolean> {
        const version = this.currentLoginVersion()
        const salt = Crypto.getSalt()

        try {
            await Postgres.query({
                sql: `
                    INSERT INTO login (username, version, salt, password)
                    VALUES ($1::text, $2::int, $3::text, '')`,
                values: [username, version, salt],
            })
        } catch {
            return false
        }
        return true
    }

    async Delete({ username }: { username: string }): Promise<boolean> {
        try {
            await Postgres.query({
                sql: "DELETE FROM login WHERE username = $1::text",
                values: [username],
            })
        } catch {
            return false
        }
        return true
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

    private currentLoginVersion(): number {
        return 1
    }
}
