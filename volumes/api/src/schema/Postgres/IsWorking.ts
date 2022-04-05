import * as Graphql from "graphql"
import { Database } from "../../api/Database"
import { Generator } from "../../Generator"

export class IsWorking extends Generator {
    constructor() {
        super()

        super.type = Graphql.GraphQLBoolean

        super.resolve = (_: any): Promise<boolean> => {
            return new Database().isWorking()
        }
    }
}
