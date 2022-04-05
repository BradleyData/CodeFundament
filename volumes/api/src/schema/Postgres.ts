import * as Graphql from "graphql"
import { Generator } from "../Generator"
import { IsWorking } from "./Postgres/IsWorking"

export class Postgres extends Generator {
    constructor() {
        super()
        super.type = this.newType()
    }

    newType(): Graphql.GraphQLObjectType {
        return new Graphql.GraphQLObjectType({
            fields: {
                IsWorking: new IsWorking().generate(),
            },
            name: "Postgres",
        })
    }
}
