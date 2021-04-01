import { Endpoint, StatusCode } from "./Endpoint"
import { Convert } from "./Convert"
import { TestHelperData } from "./testHelper/TestHelperData"

describe(Endpoint.name, () => {
    const rowsAffected = TestHelperData.randomInt()
    const response = TestHelperData.randomString()
    const name = TestHelperData.randomString()
    const apiVersion = TestHelperData.randomInt()
    const parameters = Convert.urlParametersToObject({
        urlParameters: "parameters",
    })
    const testError1 = new TypeError(TestHelperData.randomString())
    const testError2 = TestHelperData.randomString()
    class AllActions extends Endpoint {
        private setup(): void {
            this.rowsAffected = rowsAffected
            this.response = response
        }
        protected async delete(): Promise<void> {
            await this.setup()
        }
        protected async get(): Promise<void> {
            await this.setup()
        }
        protected async post(): Promise<void> {
            await this.setup()
        }
    }
    class NoActions extends Endpoint {}
    class TestDefaultResponse extends Endpoint {
        // eslint-disable-next-line no-empty-function
        protected async get(): Promise<void> {}
    }
    class ThrowError extends Endpoint {
        /* eslint-disable require-await */
        protected async get(): Promise<void> {
            this.returnError({ error: testError1, output: {} })
        }
        protected async post(): Promise<void> {
            this.returnError({ error: testError2, output: {} })
        }
        /* eslint-enable require-await */
    }

    describe.each([
        ["delete", StatusCode.noContent],
        ["get", StatusCode.ok],
        ["post", StatusCode.created],
    ])("%s", (action: string, statusCode: number) => {
        test("with actions defined", async () => {
            const endpoint = new AllActions({
                action,
                apiVersion,
                name,
                parameters,
            })

            await endpoint.init()

            expect(endpoint.getName()).toBe(name)
            expect(endpoint.getStatusCode()).toBe(statusCode)
            expect(endpoint.getRowsAffected()).toBe(rowsAffected)
            expect(endpoint.getResponse()).toBe(response)
        })

        test("without actions defined", async () => {
            const endpoint = new NoActions({
                action,
                apiVersion,
                name,
                parameters,
            })

            await endpoint.init()

            expect(endpoint.getName()).toBe(name)
            expect(endpoint.getStatusCode()).toBe(StatusCode.badRequest)
            expect(endpoint.getRowsAffected()).toBe(0)
            expect(endpoint.getResponse()).toBe("{}")
        })
    })

    test("invalid action", async () => {
        const endpoint = new AllActions({
            action: "invalid action",
            apiVersion,
            name,
            parameters,
        })

        await endpoint.init()

        expect(endpoint.getName()).toBe(name)
        expect(endpoint.getStatusCode()).toBe(StatusCode.badRequest)
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })

    test("default response", async () => {
        const endpoint = new TestDefaultResponse({
            action: "get",
            apiVersion,
            name,
            parameters,
        })

        await endpoint.init()

        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })

    test("return error 1", async () => {
        const endpoint = new ThrowError({
            action: "get",
            apiVersion,
            name,
            parameters,
        })
        const output = {
            error: {
                message: testError1.message,
                name: testError1.name,
                stack: testError1.stack,
            },
        }

        await endpoint.init()

        expect(endpoint.getStatusCode()).toBe(StatusCode.badRequest)
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe(JSON.stringify(output))
    })

    test("return error 2", async () => {
        const endpoint = new ThrowError({
            action: "post",
            apiVersion,
            name,
            parameters,
        })
        const output = {
            error: {
                message: testError2,
                name: "Non-error Object",
                stack: [],
            },
        }

        await endpoint.init()

        expect(endpoint.getStatusCode()).toBe(StatusCode.badRequest)
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe(JSON.stringify(output))
    })
})
