import { Postgres } from "../../wrapper/Postgres"
import { StatusCode } from "../../Endpoint"
import { TestHelperPostgres } from "../../testHelper/TestHelperPostgres"
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
            Postgres.query = TestHelperPostgres.queryMock(
                rowsAffected,
                errorMsg,
                (values?: any) => {
                    return result === false ? [] : [{ username: values[0] }]
                },
                result
            )

            const usernameExists = new UsernameExists("", 1, "get", {
                username: username,
            })
            await usernameExists.init()

            // eslint-disable-next-line no-undefined
            if (result === undefined) {
                expect(usernameExists.getStatusCode()).toBe(
                    StatusCode.badRequest
                )
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
