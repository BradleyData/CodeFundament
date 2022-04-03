import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import { GraphQLBoolean } from "graphql"
import { Schema } from "./Schema"
import Sinon from "sinon"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const schema = new Schema()

    before(() => {
        const overrides = {
            generate: {
                type: GraphQLBoolean,
            },
        }

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

        const query = result.getQueryType()
        const queryFields =
            query === null || query === undefined ? {} : query.getFields() // eslint-disable-line no-undefined

        expect(result).to.be.a("GraphQLSchema")
        expect(queryFields).to.not.be.empty
    })
})
