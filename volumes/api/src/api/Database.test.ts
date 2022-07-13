import { Database } from "./Database"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"
import Sinon from "sinon"
import { TestHelperData } from "../testHelper/TestHelperData"
import { TestHelperPostgres } from "../testHelper/TestHelperPostgres"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const database = new Database()

    /* eslint-disable no-unused-vars */
    let query: Sinon.SinonStub<
        [
            {
                sql: string
                useResults?: ({
                    queryResult,
                }: {
                    queryResult: QueryResult<any>
                }) => void
                values?: any
            }
        ],
        Promise<number>
    >
    /* eslint-enable no-unused-vars */

    beforeEach(() => {
        query = Sinon.stub(Postgres, "query")
    })

    afterEach(() => {
        query.restore()
    })

    it("queries the database", async () => {
        const message = /^The database.*$/u
        const values = [Sinon.match(message)]

        await database.isWorking()

        TestHelperPostgres.expectQueryExists({
            queryStub: query,
            queryType: "SELECT",
            withValues: values,
        })
    })

    it("returns true when messages match", async () => {
        await database.isWorking()
        const message = query.firstCall.args[0].values[0]

        const result = await checkMessage({ message })

        expect(result).to.be.true
    })

    it("returns false when messages are different", async () => {
        const message = TestHelperData.randomString()

        const result = await checkMessage({ message })

        expect(result).to.be.false
    })

    async function checkMessage({
        message,
    }: {
        message: string
    }): Promise<boolean> {
        const queryResult = TestHelperPostgres.queryResultMock({
            rows: [{ message }],
        })

        query.yieldsTo("useResults", { queryResult })
        return await database.isWorking()
    }
})
