import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { GraphQLBoolean } from "graphql"
import { Postgres } from "./Postgres"
import Sinon from "sinon"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    before(() => {
        EnvironmentSetup.mockClass({
            className: "IsWorking",
            fileName: "schema/Postgres/IsWorking",
            overrides: {
                generate: {
                    type: GraphQLBoolean,
                },
            },
        })
    })

    after(() => {
        Sinon.restore()
    })

    it("initializes", () => {
        const postgres = new Postgres()

        expect(postgres.generate().type.toString()).to.not.be.empty
        expect(postgres.newType().getFields()).to.not.be.empty
    })
})
