import * as Graphql from "graphql"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Postgres } from "./Postgres"
import Sinon from "sinon"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    before(() => {
        EnvironmentSetup.stubClass({
            className: "IsWorking",
            fileName: "schema/Postgres/IsWorking",
            overrides: {
                generate: {
                    type: Graphql.GraphQLBoolean,
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
