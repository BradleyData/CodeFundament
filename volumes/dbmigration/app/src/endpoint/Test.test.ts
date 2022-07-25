import { Branch } from "../Branch"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Git } from "../wrapperUnshared/Git"
import Sinon from "sinon"
import { Test } from "./Test"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    let stubBranch: Sinon.SinonStub

    before(() => {
        stubBranch = Sinon.stub(Branch, "runTests").resolves(["", ""])
    })

    after(() => {
        Sinon.restore()
    })

    it("has no parameters", async () => {
        const endpoint = new Test({
            action: "get",
            name: "",
            parameters: {},
        })

        await endpoint.init()

        expect(stubBranch).to.be.calledWith({
            branchType: Git.branchType.current,
        })
        expect(endpoint.getResponse()).to.contain("<br>")
    })

    it("is passed production", async () => {
        const parameters = { branchType: Git.branchType.production }
        const endpoint = new Test({
            action: "get",
            name: "",
            parameters,
        })

        await endpoint.init()

        expect(stubBranch).to.be.calledWith(parameters)
    })
})
