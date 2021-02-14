import { Postgres } from "../../wrapper/Postgres"
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
            Postgres.query = TestHelperPostgres.queryMock({
                errorMsg,
                expected: result,
                getRows: (values?: any) => {
                    return result === false ? [] : [{ username: values[0] }]
                },
                rowsAffected,
            })

            const usernameExists = new UsernameExists("", 1, "get", {
                username: username,
            })
            await usernameExists.init()

            // eslint-disable-next-line no-undefined
            if (result === undefined) {
                TestHelperPostgres.expectBadRequest({
                    endpoint: usernameExists,
                    errorMsg,
                    responseKey: "usernameExists",
                    responseValue: true,
                })
            } else {
                expect(usernameExists.getRowsAffected()).toBe(rowsAffected)
                TestHelperPostgres.expectQueryExists({ queryType: "SELECT" })
                expect(usernameExists.getResponse()).toBe(
                    JSON.stringify({ usernameExists: result })
                )
            }
        }
    )
})
