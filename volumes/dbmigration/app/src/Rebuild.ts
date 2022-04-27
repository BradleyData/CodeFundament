import { Git } from "./wrapperUnshared/Git"
import { Postgres as Pg1 } from "./wrapper/Postgres"
import { Postgres as Pg2 } from "./wrapperUnshared/Postgres"
import { readFileSync } from "fs"

export class Rebuild {
    static updateDb(): Promise<void>
    static updateDb({
        /* eslint-disable no-unused-vars */
        branchType,
    }: /* eslint-enable no-unused-vars */
    {
        branchType?: Git.branchType
    }): Promise<void>
    static async updateDb({
        branchType = "",
    }: { branchType?: Git.branchType | "" } = {}): Promise<void> {
        if (branchType !== "") 
            Git.retrieveBranch({ branchType })

        const schemaQueries = readFileSync(
            `/home/node/migrations/schema${branchType}.sql`,
            "utf8"
        )
        await Pg2.recreate()
        Pg1.query({
            sql: schemaQueries,
            values: [],
        })
    }
}
