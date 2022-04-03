import { Database } from "../../api/Database"
import { Generator } from "../../Generator"
import { GraphQLBoolean } from "graphql"

export class IsWorking extends Generator {
    constructor() {
        super()

        super.type = GraphQLBoolean

        super.resolve = (_: any): Promise<boolean> => {
            return new Database().isWorking()
        }
    }
}
