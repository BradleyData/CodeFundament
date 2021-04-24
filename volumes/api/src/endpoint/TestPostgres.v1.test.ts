import { Postgres } from "../wrapper/Postgres"
import { TestHelperData } from "../testHelper/TestHelperData"
import { TestHelperPostgres } from "../testHelper/TestHelperPostgres"
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
            const rowsAffected = TestHelperData.randomInt()
            const errorMsg = TestHelperData.randomString()
            Postgres.query = TestHelperPostgres.queryMock({
                errorMsg,
                expected: hasPostgres,
                getRows: (values?: any) => {
                    return [{ message: hasPostgres === false ? "" : values[0] }]
                },
                rowsAffected,
            })

            const testPostgres = new TestPostgres({
                action: "get",
                apiVersion: TestHelperData.randomInt(),
                name: TestHelperData.randomString(),
                parameters: {},
            })
            await testPostgres.init()

            // eslint-disable-next-line no-undefined
            if (hasPostgres === undefined) {
                TestHelperPostgres.expectBadRequest({
                    endpoint: testPostgres,
                    errorMsg,
                    responseKey: "postgres",
                    responseValue: false,
                })
            } else {
                expect(testPostgres.getRowsAffected()).toBe(rowsAffected)
                TestHelperPostgres.expectQueryExists({ queryType: "SELECT" })
                expect(testPostgres.getResponse()).toBe(
                    JSON.stringify({ postgres: hasPostgres })
                )
            }
        }
    )
})
