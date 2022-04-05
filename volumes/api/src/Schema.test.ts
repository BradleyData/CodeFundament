import * as Graphql from "graphql"
import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import { Schema } from "./Schema"
import Sinon from "sinon"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const schema = new Schema()

    before(() => {
        const overrides = {
            generate: {
                type: Graphql.GraphQLBoolean,
            },
        }

        EnvironmentSetup.mockClass({
            className: "Account",
            fileName: "schema/Account",
            overrides,
        })

        EnvironmentSetup.mockClass({
            className: "Postgres",
            fileName: "schema/Postgres",
            overrides,
        })

        EnvironmentSetup.mockClass({
            className: "UsernameExists",
            fileName: "schema/UsernameExists",
            overrides,
        })
    })

    after(() => {
        Sinon.restore()
    })

    it("generates a GraphQL schema", () => {
        const result = schema.generate()

        expect(result).to.be.a("GraphQLSchema")
        expect(getFields({ objectType: result.getMutationType() })).to.not.be
            .empty
        expect(getFields({ objectType: result.getQueryType() })).to.not.be.empty
    })

    function getFields({
        objectType,
    }: {
        objectType: null | undefined | Graphql.GraphQLObjectType
    }): Graphql.GraphQLFieldMap<any, any> {
        /* eslint-disable no-undefined */
        if (objectType === null || objectType === undefined) 
            return {}
        /* eslint-enable no-undefined */
        return objectType.getFields()
    }
})
