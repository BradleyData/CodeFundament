import { Branch } from "./Branch"
import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import { Fs } from "./wrapper/Fs"
import { Git } from "./wrapperUnshared/Git"
import { Postgres as Pg1 } from "./wrapper/Postgres"
import { Postgres as Pg2 } from "./wrapperUnshared/Postgres"
import Sinon from "sinon"
import { TestHelperData } from "./testHelper/TestHelperData"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    function replaceDependencies({
        testsReturn,
        truncationReturn,
    }: {
        testsReturn: boolean
        truncationReturn: boolean
    }): void {
        Sinon.replace(Fs, "readFileSync", Sinon.fake())
        Sinon.replace(Git, "retrieveBranch", Sinon.fake())
        Sinon.replace(
            Git,
            "runAcceptanceTests",
            Sinon.fake.returns({ output: "", successful: testsReturn })
        )
        Sinon.replace(Pg1, "query", Sinon.fake())
        Sinon.replace(Pg2, "truncateDb", Sinon.fake.resolves(truncationReturn))
    }

    afterEach(() => {
        Sinon.restore()
    })

    it("works for current with all successes", async () => {
        replaceDependencies({ testsReturn: true, truncationReturn: true })
        const result = await Branch.runTests()

        const resultString = result.toString()

        expect(result[0]).to.be.not.empty
        expect(result[0]).to.include("Rebuilt")
        expect(resultString).to.include("current")
        expect(resultString).to.include("<pre>")
        expect(resultString).to.include("succeeded")
    })

    it("works for production with all successes", async () => {
        replaceDependencies({
            testsReturn: TestHelperData.randomBool(),
            truncationReturn: TestHelperData.randomBool(),
        })
        const result = await Branch.runTests({
            branchType: Git.branchType.production,
        })

        const resultString = result.toString()

        expect(resultString).to.include("Retrieved")
        expect(resultString).to.include("production")
    })

    it("works for current with truncation failure", async () => {
        replaceDependencies({
            testsReturn: TestHelperData.randomBool(),
            truncationReturn: false,
        })
        const result = await Branch.runTests()

        const resultString = result.toString()

        expect(resultString).to.include("Unable")
    })

    it("works for current with test failure", async () => {
        replaceDependencies({ testsReturn: false, truncationReturn: true })
        const result = await Branch.runTests()

        const resultString = result.toString()

        expect(resultString).to.include("failed")
    })
})
