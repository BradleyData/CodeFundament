import { Account } from "./Account"
import { EnvironmentSetup } from "../../testHelper/EnvironmentSetup"
import { Postgres } from "../../wrapper/Postgres"
import { QueryResult } from "pg"
import Sinon from "sinon"
import { TestHelperData } from "../../testHelper/TestHelperData"
import { TestHelperPostgres } from "../../testHelper/TestHelperPostgres"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const account = new Account()

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
                values: any
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
        const exists = false
        const username = TestHelperData.randomString()

        await account.UsernameExists(username)

        TestHelperPostgres.expectQueryExists({
            queryStub: query,
            queryType: "SELECT",
            withValues: [username, exists],
        })
    })

    it("returns true when username exists", async () => {
        const isValid = true
        const username = TestHelperData.randomString()

        const result = await checkUsername({ isValid, username })

        expect(result).to.be.true
    })

    it("returns false when username does not exist", async () => {
        const isValid = false
        const username = TestHelperData.randomString()

        const result = await checkUsername({ isValid, username })

        expect(result).to.be.false
    })

    async function checkUsername({
        isValid,
        username,
    }: {
        isValid: boolean
        username: string
    }): Promise<boolean> {
        const queryResult = TestHelperPostgres.queryResultMock({
            rows: isValid ? [{ username }] : [],
        })

        query.yieldsTo("useResults", { queryResult })
        return await account.UsernameExists(username)
    }
})
