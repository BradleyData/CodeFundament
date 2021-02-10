import { Postgres } from "../../wrapper/Postgres"
import { QueryResult } from "pg"
import { UsernameExists } from "./UsernameExists.v1"

jest.mock("../../wrapper/Postgres", () => {
    return {
        Postgres: jest.fn(),
    }
})

describe(UsernameExists.name, () => {
    // eslint-disable-next-line no-undefined
    test.each([[true], [false], [undefined]])(
        "post: username existence is %p",
        async (result?: boolean) => {
            const rowsAffected = result === true ? 1 : 0
            const errorMsg = "errorMsg"
            const username = "newUser85"
            Postgres.query = jest.fn().mockImplementation(
                (
                    sql: string,
                    values: any,
                    // eslint-disable-next-line no-unused-vars
                    useResults: (queryResult: QueryResult) => void
                ) => {
                    // eslint-disable-next-line no-param-reassign, no-self-assign
                    sql = sql
                    // eslint-disable-next-line no-param-reassign, no-self-assign
                    values = values

                    // eslint-disable-next-line no-undefined
                    if (result === undefined) 
                        throw errorMsg

                    useResults(getQueryResult(result ? values[0] : ""))
                    return Promise.resolve(rowsAffected)
                }
            )

            const usernameExists = new UsernameExists("", 1, "post", username)
            await usernameExists.init()

            // eslint-disable-next-line no-undefined
            if (result === undefined) {
                expect(usernameExists.getRowsAffected()).toBe(0)
                const response = JSON.parse(usernameExists.getResponse())
                expect(response.error).toBe(errorMsg)
                expect(response.usernameExists).toBe(true)
            } else {
                expect(usernameExists.getRowsAffected()).toBe(rowsAffected)
                expect(Postgres.query).toBeCalledWith(
                    expect.stringContaining("SELECT"),
                    expect.arrayContaining([expect.any(String)]),
                    expect.any(Function)
                )
                expect(usernameExists.getResponse()).toBe(
                    JSON.stringify({ usernameExists: result })
                )
            }
        }
    )
})

function getQueryResult(username: string): QueryResult {
    const rows = username === "" ? [] : [{ username: username }]
    return {
        command: "",
        fields: [],
        oid: 0,
        rowCount: 0,
        rows: rows,
    }
}
