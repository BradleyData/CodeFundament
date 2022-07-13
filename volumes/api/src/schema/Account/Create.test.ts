import { Create } from "./Create"
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
                create: () => {
                    return true
                },
            },
        })
    })

    after(() => {
        Sinon.restore()
    })

    it("initializes", () => {
        const create = new Create()

        expect(create.generate().args).to.not.be.empty
    })
})
