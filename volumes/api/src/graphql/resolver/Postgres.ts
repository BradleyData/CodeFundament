import { FieldResolver, Query, Resolver, ResolverInterface } from "type-graphql"
import { Postgres as Pg } from "../../wrapper/Postgres"
import { Postgres as PostgresType } from "../type/Postgres"
import { QueryResult } from "pg"

@Resolver((of) => PostgresType)
export class Postgres implements ResolverInterface<PostgresType> {
    private postgresType: PostgresType

    constructor() {
        this.postgresType = new PostgresType()
    }

    @Query()
    Postgres(): PostgresType {
        return this.postgresType
    }

    @FieldResolver()
    async IsWorking(): Promise<boolean> {
        const message = "Postgres is working."

        try {
            await Pg.query({
                sql: "SELECT $1::text AS message",
                useResults: ({
                    queryResult,
                }: {
                    queryResult: QueryResult
                }): void => {
                    this.postgresType.IsWorking =
                        queryResult.rows[0].message === message
                },
                values: [message],
            })
        } catch (error) {} // eslint-disable-line no-empty

        return this.postgresType.IsWorking
    }
}
