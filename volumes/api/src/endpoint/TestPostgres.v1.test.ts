import Postgres from "../wrapper/Postgres"
import { QueryResult } from "pg"
import TestHelper from "../TestHelper"
import TestPostgres from "./TestPostgres.v1"

jest.mock("../wrapper/Postgres", () => jest.fn())

describe(TestPostgres.name, () => {
    // eslint-disable-next-line no-undefined
    test.each([[true], [false], [undefined]])(
        "get: postgres is %p",
        async (hasPostgres?: boolean) => {
            const rowsAffected = TestHelper.randomInt()
            const errorMsg = "errorMsg"
            Postgres.query = jest.fn().mockImplementation(
                (
                    sql: string,
                    values: any,
                    // eslint-disable-next-line no-unused-vars
                    useResults: (queryResult: QueryResult) => void
                ) => {
                    // eslint-disable-next-line no-param-reassign, no-self-assign
                    sql = sql

                    // eslint-disable-next-line no-undefined
                    if (hasPostgres === undefined) 
                        throw errorMsg

                    useResults(getQueryResult(hasPostgres ? values[0] : ""))
                    return Promise.resolve(rowsAffected)
                }
            )

            const testPostgres = new TestPostgres("", 1, "get", "")
            await testPostgres.init()

            // eslint-disable-next-line no-undefined
            if (hasPostgres === undefined) {
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

function getQueryResult(message: string): QueryResult {
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
