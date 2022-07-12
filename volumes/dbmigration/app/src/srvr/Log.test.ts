import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Log } from "./Log"
import Sinon from "sinon"
import { TestHelperData } from "../testHelper/TestHelperData"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    after(() => {
        Sinon.reset()
    })

    it("outputs an error to the console log", () => {
        const stub = Sinon.stub(console, "log")
        const action = TestHelperData.randomString()
        const error = new Error(TestHelperData.randomString())
        error.stack = undefined // eslint-disable-line no-undefined
        const url = TestHelperData.randomString()

        Log.error({ action, error, url })

        expect(stub).to.be.called.calledWithMatch(action)
        expect(stub).to.be.called.calledWithMatch(url)
        expect(stub).to.be.called.calledWithMatch(error.message)
    })
})
