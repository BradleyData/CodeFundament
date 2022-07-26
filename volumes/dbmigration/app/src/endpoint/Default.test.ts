import { Default } from "./Default"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Fs } from "../wrapper/Fs"
import Sinon from "sinon"
import { TestHelperData } from "../testHelper/TestHelperData"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const result = TestHelperData.randomString()
    let readFileSync: Sinon.SinonStub<[{ file: string }], string>

    before(() => {
        readFileSync = Sinon.stub(Fs, "readFileSync").returns(result)
    })

    after(() => {
        Sinon.restore()
    })

    it("generates content", async () => {
        const endpoint = new Default({
            action: "get",
            name: "",
            parameters: {},
        })

        await endpoint.init()

        expect(endpoint.getResponse()).to.equal(result)
        expect(readFileSync).to.be.calledWith(
            Sinon.match.has("file", Sinon.match("/src/html/"))
        )
    })
})
