import * as Graphql from "graphql"
import { Account } from "../../api/Account"
import { Generator } from "../../Generator"

export class Delete extends Generator {
    constructor() {
        super()

        super.type = Graphql.GraphQLBoolean

        super.args = {
            username: {
                type: Graphql.GraphQLNonNull(Graphql.GraphQLString),
            },
        }

        super.resolve = (_: any, { username }: any): Promise<boolean> => {
            return new Account().delete({ username })
        }
    }
}
