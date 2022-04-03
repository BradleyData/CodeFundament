import {
    GraphQLBoolean,
    GraphQLDirective,
    GraphQLObjectType,
    GraphQLResolveInfo,
} from "graphql"

const mockGraphQLResolveInfo: GraphQLResolveInfo = {
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
    parentType: new GraphQLObjectType({
        fields: {},
        name: "",
    }),
    path: {
        key: "",
        prev: undefined,
        typename: "",
    },
    returnType: GraphQLBoolean,
    rootValue: undefined,
    schema: {
        astNode: undefined,
        description: "",
        extensionASTNodes: undefined,
        extensions: undefined,
        getDirective: () => {
            return new GraphQLDirective({
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
            return new GraphQLObjectType({
                fields: {},
                name: "",
            })
        },
        getPossibleTypes: () => {
            return []
        },
        getQueryType: () => {
            return new GraphQLObjectType({
                fields: {},
                name: "",
            })
        },
        getSubscriptionType: () => {
            return new GraphQLObjectType({
                fields: {},
                name: "",
            })
        },
        getType: () => {
            return new GraphQLObjectType({
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
