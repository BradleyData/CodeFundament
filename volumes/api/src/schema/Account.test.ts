import * as Graphql from "graphql"
import { Account } from "./Account"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import Sinon from "sinon"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    before(() => {
        const overrides = {
            generate: {
                type: Graphql.GraphQLBoolean,
            },
        }

        EnvironmentSetup.mockClass({
            className: "Create",
            fileName: "schema/Account/Create",
            overrides,
        })

        EnvironmentSetup.mockClass({
            className: "Delete",
            fileName: "schema/Account/Delete",
            overrides,
        })
    })

    after(() => {
        Sinon.restore()
    })

    it("initializes", () => {
        const account = new Account()

        expect(account.generate().type.toString()).to.not.be.empty
        expect(account.newType().getFields()).to.not.be.empty
    })
})
