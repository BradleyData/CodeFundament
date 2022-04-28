import { Git } from "./wrapperUnshared/Git"
import { Postgres as Pg1 } from "./wrapper/Postgres"
import { Postgres as Pg2 } from "./wrapperUnshared/Postgres"
import { readFileSync } from "fs"

export class Branch {
    static runTests(): Promise<string>
    static runTests({
        /* eslint-disable no-unused-vars */
        branchType,
    }: /* eslint-enable no-unused-vars */
    {
        branchType?: Git.branchType | ""
    }): Promise<string>
    static async runTests({
        branchType = "",
    }: { branchType?: Git.branchType | "" } = {}): Promise<string> {
        let results = ""
        const branchName = branchType === "" ? "current" : branchType

        if (branchType !== "") {
            Git.retrieveBranch({ branchType })
            results += `Retrieved ${branchName}.<br>`
        }

        await Pg2.truncateDb()
        await Pg1.query({
            sql: readFileSync(
                `/home/node/migrations/schema${branchType}.sql`,
                "utf8"
            ),
            values: [],
        })
        results += "Rebuilt database.<br>"

        const testResults = Git.runAcceptanceTests({ branchType })
        results += `Tests on ${branchName} ${
            testResults.successful ? "succeeded" : "failed"
        }.`
        results += `<pre>${testResults.output}</pre>`

        return results
    }
}
