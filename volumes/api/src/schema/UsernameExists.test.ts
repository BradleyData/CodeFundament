import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import Sinon from "sinon"
import { UsernameExists } from "./UsernameExists"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    before(() => {
        EnvironmentSetup.stubClass({
            className: "Account",
            fileName: "api/Account",
            overrides: {
                usernameExists: () => {
                    return true
                },
            },
        })
    })

    after(() => {
        Sinon.restore()
    })

    it("initializes", () => {
        const usernameExists = new UsernameExists()

        expect(usernameExists.generate().args).to.not.be.empty
    })
})
