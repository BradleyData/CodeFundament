import { Create } from "./Create.v1"
import { Postgres } from "../../wrapper/Postgres"
import { TestHelperData } from "../../testHelper/TestHelperData"
import { TestHelperPostgres } from "../../testHelper/TestHelperPostgres"

jest.mock("../../wrapper/Postgres", () => {
    return {
        Postgres: jest.fn(),
    }
})

describe(Create.name, () => {
    const rowsAffected = 1
    const errorMsg = TestHelperData.randomString()
    const username = TestHelperData.randomString()
    const loginVersion = TestHelperData.randomInt().toString()
    Postgres.query = TestHelperPostgres.queryMock({
        errorMsg,
        expected: true,
        getRows: () => {
            return []
        },
        rowsAffected,
    })

    test("new account", async () => {
        const create = new Create({
            action: "post",
            apiVersion: TestHelperData.randomInt(),
            name: TestHelperData.randomString(),
            parameters: {
                loginVersion,
                username,
            },
        })
        await create.init()

        expect(create.getRowsAffected()).toBe(rowsAffected)
        TestHelperPostgres.expectQueryExists({
            queryType: "INSERT",
            withValues: [
                expect.any(String),
                expect.any(Number),
                expect.any(String),
                "",
            ],
        })
        expect(create.getResponse()).toBe(JSON.stringify({}))
    })

    test("new account error", async () => {
        const create = new Create({
            action: "post",
            apiVersion: TestHelperData.randomInt(),
            name: TestHelperData.randomString(),
            parameters: {
                loginVersion,
            }
        })
        await create.init()

        expect(create.getRowsAffected()).toBe(0)
        TestHelperPostgres.expectBadRequest({
            endpoint: create,
            errorMsg: errorMsg,
            responseKey: "",
            responseValue: "",
        })
        expect(create.getResponse()).toBe(JSON.stringify({}))
    })
})

/*
1) instead of the error genenrated, generate a sql error
2) rewrite the parameter checks to be generic somehow.
    parameters should be defined per endpoint/action
    allow for optional parameters
    no need for type checking, that is best done in the enpoint code
*/