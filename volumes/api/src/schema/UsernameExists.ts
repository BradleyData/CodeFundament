import { GraphQLBoolean, GraphQLString } from "graphql"
import { Account } from "../api/Account"
import { Generator } from "../Generator"

export class UsernameExists extends Generator {
    constructor() {
        super()

        super.type = GraphQLBoolean

        super.args = {
            username: {
                type: GraphQLString,
            },
        }

        super.resolve = (_: any, { username }: any): Promise<boolean> => {
            return new Account().usernameExists({ username })
        }
    }
}
