import { Fs } from "./wrapper/Fs"
import { Git } from "./wrapperUnshared/Git"
import { Postgres as Pg1 } from "./wrapper/Postgres"
import { Postgres as Pg2 } from "./wrapperUnshared/Postgres"

export class Branch {
    static runTests(): Promise<string[]>
    static runTests({
        /* eslint-disable no-unused-vars */
        branchType,
    }: /* eslint-enable no-unused-vars */
    {
        branchType?: Git.branchType | ""
    }): Promise<string[]>
    static async runTests({
        branchType = "",
    }: { branchType?: Git.branchType | "" } = {}): Promise<string[]> {
        const results: string[] = []
        const branchName = branchType === "" ? "current" : branchType

        if (branchType !== "") {
            Git.retrieveBranch({ branchType })
            results.push(`Retrieved ${branchName}.`)
        }

        if (!await Pg2.truncateDb())
            return results.concat(`Unable to drop/create db for ${branchName}.`)
        try {
            await Pg1.query({
                sql: Fs.readFileSync({
                    file: `/home/node/migrations/schema${branchType}.sql`,
                }),
            })
            results.push("Rebuilt database.")
        } catch {
            return results.concat("Schema file failed to run.<br>")
        }

        const testResults = Git.runAcceptanceTests({ branchType })
        results.push(
            `Tests on ${branchName} ${
                testResults.successful ? "succeeded" : "failed"
            }.`
        )
        results.push(`<pre>${testResults.output}</pre>`)

        return results
    }
}
