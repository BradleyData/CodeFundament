import * as Graphql from "graphql"
import { Create } from "./Account/Create"
import { Delete } from "./Account/Delete"
import { Generator } from "../Generator"

export class Account extends Generator {
    constructor() {
        super()

        super.type = this.newType()
    }

    newType(): Graphql.GraphQLObjectType {
        return new Graphql.GraphQLObjectType({
            fields: {
                Create: new Create().generate(),
                Delete: new Delete().generate(),
            },
            name: "Account",
        })
    }
}
