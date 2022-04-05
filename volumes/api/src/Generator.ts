import * as Graphql from "graphql"

export class Generator {
    protected type: Graphql.GraphQLOutputType = Graphql.GraphQLBoolean

    protected resolve: Graphql.GraphQLFieldResolver<
        string,
        string,
        { [argName: string]: any }
    > = () => {
            return false
        }

    protected args?: Graphql.GraphQLFieldConfigArgumentMap

    generate(): Graphql.GraphQLFieldConfig<string, string> {
        return {
            args: this.args,
            resolve: this.resolve,
            type: this.type,
        }
    }
}
