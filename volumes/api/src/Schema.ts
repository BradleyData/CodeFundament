import { GraphQLObjectType, GraphQLSchema } from "graphql"
import { Postgres } from "./schema/Postgres"
import { UsernameExists } from "./schema/UsernameExists"
// import { DefaultFalse } from "./type/DefaultFalse"

export class Schema {
    generate(): GraphQLSchema {
        return new GraphQLSchema({
            // mutation: new GraphQLObjectType({
            //     fields: {
            //         Create: {
            //             args: {
            //                 username: {
            //                     type: GraphQLString,
            //                 },
            //             },
            //             type: GraphQLBoolean,
            //         },
            //     },
            //     name: "Mutation",
            // }),
            query: new GraphQLObjectType({
                fields: {
                    Postgres: new Postgres().generate(),
                    UsernameExists: new UsernameExists().generate(),
                },
                name: "Query",
            }),
        })
    }
}
