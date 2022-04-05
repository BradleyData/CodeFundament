import { Account } from "./Account"
import { Crypto } from "../wrapper/Crypto"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"
import Sinon from "sinon"
import { TestHelperData } from "../testHelper/TestHelperData"
import { TestHelperPostgres } from "../testHelper/TestHelperPostgres"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const account = new Account()
    const salt = Sinon.replace(
        Crypto,
        "getSalt",
        Sinon.fake.returns(TestHelperData.randomString())
    )

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

    describe("check if username exists", () => {
        it("queries the database", async () => {
            const username = TestHelperData.randomString()

            await account.usernameExists({ username })

            TestHelperPostgres.expectQueryExists({
                queryStub: query,
                queryType: "SELECT",
                withValues: [username],
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
    })

    describe("creation", () => {
        it("can create an account", async () => {
            const username = TestHelperData.randomString()

            const result = await account.create({ username })

            TestHelperPostgres.expectQueryExists({
                queryStub: query,
                queryType: "INSERT",
                withValues: [username, Sinon.match.number, salt()],
            })
            expect(result).to.be.true
        })

        it("cannot create an account", async () => {
            const username = TestHelperData.randomString()

            query.throws()
            const result = await account.create({ username })

            expect(result).to.be.false
        })
    })

    describe("deletion", () => {
        it("can delete an account", async () => {
            const username = TestHelperData.randomString()

            const result = await account.delete({ username })

            TestHelperPostgres.expectQueryExists({
                queryStub: query,
                queryType: "DELETE",
                withValues: [username],
            })
            expect(result).to.be.true
        })

        it("cannot delete an account", async () => {
            const username = TestHelperData.randomString()

            query.throws()
            const result = await account.delete({ username })

            expect(result).to.be.false
        })
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
        return await account.usernameExists({ username })
    }
})
