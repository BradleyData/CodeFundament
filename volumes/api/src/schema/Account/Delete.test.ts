import { Delete } from "./Delete"
import { EnvironmentSetup } from "../../testHelper/EnvironmentSetup"
import Sinon from "sinon"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    before(() => {
        EnvironmentSetup.stubClass({
            className: "Account",
            fileName: "api/Account",
            overrides: {
                delete: () => {
                    return true
                },
            },
        })
    })

    after(() => {
        Sinon.restore()
    })

    it("initializes", () => {
        const del = new Delete()

        expect(del.generate().args).to.not.be.empty
    })
})
