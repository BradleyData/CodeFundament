import * as Graphql from "graphql"
import { Account } from "./schema/Account"
import { Postgres } from "./schema/Postgres"
import { UsernameExists } from "./schema/UsernameExists"

export class Schema {
    generate(): Graphql.GraphQLSchema {
        return new Graphql.GraphQLSchema({
            mutation: new Graphql.GraphQLObjectType({
                fields: {
                    Account: new Account().generate(),
                },
                name: "Mutation",
            }),
            query: new Graphql.GraphQLObjectType({
                fields: {
                    Postgres: new Postgres().generate(),
                    UsernameExists: new UsernameExists().generate(),
                },
                name: "Query",
            }),
        })
    }
}
