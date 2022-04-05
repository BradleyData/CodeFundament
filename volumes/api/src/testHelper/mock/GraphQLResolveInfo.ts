import * as Graphql from "graphql"

const mockGraphQLResolveInfo: Graphql.GraphQLResolveInfo = {
    fieldName: "",
    fieldNodes: [],
    fragments: {},
    operation: {
        kind: "OperationDefinition",
        operation: "query",
        selectionSet: {
            kind: "SelectionSet",
            selections: [],
        },
    },
    parentType: new Graphql.GraphQLObjectType({
        fields: {},
        name: "",
    }),
    path: {
        key: "",
        prev: undefined,
        typename: "",
    },
    returnType: Graphql.GraphQLBoolean,
    rootValue: undefined,
    schema: {
        astNode: undefined,
        description: "",
        extensionASTNodes: undefined,
        extensions: undefined,
        getDirective: () => {
            return new Graphql.GraphQLDirective({
                locations: [],
                name: "",
            })
        },
        getDirectives: () => {
            return []
        },
        getImplementations: () => {
            return {
                interfaces: [],
                objects: [],
            }
        },
        getMutationType: () => {
            return new Graphql.GraphQLObjectType({
                fields: {},
                name: "",
            })
        },
        getPossibleTypes: () => {
            return []
        },
        getQueryType: () => {
            return new Graphql.GraphQLObjectType({
                fields: {},
                name: "",
            })
        },
        getSubscriptionType: () => {
            return new Graphql.GraphQLObjectType({
                fields: {},
                name: "",
            })
        },
        getType: () => {
            return new Graphql.GraphQLObjectType({
                fields: {},
                name: "",
            })
        },
        getTypeMap: () => {
            return {}
        },
        isPossibleType: () => {
            return false
        },
        isSubType: () => {
            return false
        },
        toConfig: () => {
            return {
                assumeValid: true,
                directives: [],
                extensionASTNodes: [],
                extensions: [],
                types: [],
            }
        },
    },
    variableValues: {},
}

export { mockGraphQLResolveInfo }
