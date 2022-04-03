import {
    GraphQLBoolean,
    GraphQLFieldConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLFieldResolver,
    GraphQLOutputType,
} from "graphql"

export class Generator {
    protected type: GraphQLOutputType = GraphQLBoolean

    protected resolve: GraphQLFieldResolver<
        string,
        string,
        { [argName: string]: any }
    > = () => {
            return false
        }

    protected args?: GraphQLFieldConfigArgumentMap

    generate(): GraphQLFieldConfig<string, string> {
        return {
            args: this.args,
            resolve: this.resolve,
            type: this.type,
        }
    }
}
