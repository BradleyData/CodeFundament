import { Bash } from "./Bash"
import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import { expect } from "chai"

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    it("getBranchName retrieves a string", () => {
        const branchName = Bash.getBranchName()

        expect(branchName).to.be.a("string")
        expect(branchName).to.be.lengthOf.above(1)
    })
})
