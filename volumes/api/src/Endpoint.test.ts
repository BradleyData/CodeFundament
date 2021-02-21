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
})
