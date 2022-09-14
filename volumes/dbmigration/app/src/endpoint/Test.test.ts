import { Branch } from "../Branch"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Git } from "../wrapperUnshared/Git"
import Sinon from "sinon"
import { Test } from "./Test"
import { TestHelperData } from "../testHelper/TestHelperData"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    let stubBranch: Sinon.SinonStub

    beforeEach(() => {
        stubBranch = Sinon.stub(Branch, "runTests").resolves(["", ""])
    })

    afterEach(() => {
        Sinon.restore()
    })

    it("has no parameters", async () => {
        const endpoint = new Test({
            action: "get",
            name: "",
            parameters: {},
        })

        await endpoint.init()

        expect(stubBranch).to.have.callCount(Object.keys(Git.branchType).length)
        expect(stubBranch).to.be.calledWith({
            branchType: Git.branchType.current,
        })
        expect(stubBranch).to.be.calledWith({
            branchType: Git.branchType.production,
        })
    })

    it("is passed production", async () => {
        const parameters = { branchType: Git.branchType.production }
        const endpoint = new Test({
            action: "get",
            name: "",
            parameters,
        })

        await endpoint.init()

        expect(stubBranch).to.be.calledOnceWith(parameters)
        expect(endpoint.getResponse()).to.contain("<html>").and.contain("<br>").and.contain("</html>")
    })

    it("is passed an invalid branchType", async () => {
        const parameters = { branchType: TestHelperData.randomString() }
        const endpoint = new Test({
            action: "get",
            name: "",
            parameters,
        })

        await endpoint.init()

        expect(stubBranch).to.be.calledOnceWith({ branchType: Git.branchType.current })
    })
})
