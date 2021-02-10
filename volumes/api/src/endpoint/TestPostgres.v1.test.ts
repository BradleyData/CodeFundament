import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"
import { StatusCode } from "../Endpoint"
import { TestHelper } from "../TestHelper"
import { TestPostgres } from "./TestPostgres.v1"

jest.mock("../wrapper/Postgres", () => {
    return {
        Postgres: jest.fn(),
    }
})

describe(TestPostgres.name, () => {
    // eslint-disable-next-line no-undefined
    test.each([[true], [false], [undefined]])(
        "get: postgres is %p",
        async (hasPostgres?: boolean) => {
            const rowsAffected = TestHelper.randomInt()
            const errorMsg = "errorMsg"
            Postgres.query = TestHelper.getPostgresQueryMock(
                rowsAffected,
                errorMsg,
                getQueryResults,
                hasPostgres
            )

            const testPostgres = new TestPostgres("", 1, "get", "")
            await testPostgres.init()

            // eslint-disable-next-line no-undefined
            if (hasPostgres === undefined) {
                expect(testPostgres.getStatusCode()).toBe(StatusCode.badRequest)
                expect(testPostgres.getRowsAffected()).toBe(0)
                const response = JSON.parse(testPostgres.getResponse())
                expect(response.error).toBe(errorMsg)
                expect(response.postgres).toBe(false)
            } else {
                expect(testPostgres.getRowsAffected()).toBe(rowsAffected)
                expect(Postgres.query).toBeCalledWith(
                    expect.stringContaining("SELECT"),
                    expect.arrayContaining([expect.any(String)]),
                    expect.any(Function)
                )
                expect(testPostgres.getResponse()).toBe(
                    JSON.stringify({ postgres: hasPostgres })
                )
            }
        }
    )
})

function getQueryResults(expected: boolean, values?: any): QueryResult {
    const message = expected ? values[0] : ""

    return {
        command: "",
        fields: [],
        oid: 0,
        rowCount: 0,
        rows: [
            {
                message: message,
            },
        ],
    }
}
