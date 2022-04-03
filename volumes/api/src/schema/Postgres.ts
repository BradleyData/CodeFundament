import { Generator } from "../Generator"
import { GraphQLObjectType } from "graphql"
import { IsWorking } from "./Postgres/IsWorking"

export class Postgres extends Generator {
    constructor() {
        super()
        super.type = this.newType()
    }

    newType(): GraphQLObjectType {
        return new GraphQLObjectType({
            fields: {
                IsWorking: new IsWorking().generate(),
            },
            name: "Postgres",
        })
    }
}
