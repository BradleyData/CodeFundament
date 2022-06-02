import { Endpoint, StatusCode } from "./Endpoint"
import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import { TestHelperData } from "./testHelper/TestHelperData"
import { expect } from "chai"

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const name = TestHelperData.randomString()
    const parameters = {}

    describe("with actions", () => {
        const response = ""

        class TestEndpoint extends Endpoint {
            /* eslint-disable no-empty-function */
            protected async delete(): Promise<void> {}

            protected async get(): Promise<void> {}

            protected async post(): Promise<void> {}
            /* eslint-enable no-empty-function */
        }

        it("works for delete", async () => {
            await testEndpoint({
                TestEndpoint,
                action: "DELETE",
                response,
                statusCode: StatusCode.noContent,
            })
        })

        it("works for get", async () => {
            await testEndpoint({
                TestEndpoint,
                action: "GET",
                response,
                statusCode: StatusCode.ok,
            })
        })

        it("works for post", async () => {
            await testEndpoint({
                TestEndpoint,
                action: "POST",
                response,
                statusCode: StatusCode.created,
            })
        })

        it("fails for invalid actions", async () => {
            const action = TestHelperData.randomString({
                includeDigits: false,
                includeLowers: false,
                includeSymbols: false,
            })
            await testEndpoint({
                TestEndpoint,
                action,
                response,
                statusCode: StatusCode.badRequest,
            })
        })
    })

    describe("without actions", () => {
        const response = ""

        class TestEndpoint extends Endpoint {}

        it("works for delete", async () => {
            await testEndpoint({
                TestEndpoint,
                action: "DELETE",
                response,
                statusCode: StatusCode.badRequest,
            })
        })

        it("works for get", async () => {
            await testEndpoint({
                TestEndpoint,
                action: "GET",
                response,
                statusCode: StatusCode.badRequest,
            })
        })

        it("works for post", async () => {
            await testEndpoint({
                TestEndpoint,
                action: "POST",
                response,
                statusCode: StatusCode.badRequest,
            })
        })
    })

    describe("with exception", () => {
        it("gets the message, name, and stack", async () => {
            const testError = new TypeError(TestHelperData.randomString())
            const response = JSON.stringify({
                error: {
                    message: testError.message,
                    name: testError.name,
                    stack: testError.stack,
                },
            })

            await testException({ response, testError })
        })

        it("is missing the name and stack", async () => {
            const testError = TestHelperData.randomString()
            const response = JSON.stringify({
                error: {
                    message: testError,
                    name: "Non-error Object",
                    stack: [],
                },
            })

            await testException({ response, testError })
        })

        async function testException({
            response,
            testError,
        }: {
            response: string
            testError: any
        }) {
            class TestEndpoint extends Endpoint {
                /* eslint-disable require-await */
                protected async delete(): Promise<void> {
                    this.returnError({ error: testError, output: {} })
                }
                /* eslint-enable require-await */
            }

            await testEndpoint({
                TestEndpoint,
                action: "DELETE",
                response,
                statusCode: StatusCode.badRequest,
            })
        }
    })

    async function testEndpoint({
        action,
        response,
        statusCode,
        TestEndpoint,
    }: {
        action: string
        response: string
        statusCode: StatusCode
        TestEndpoint: any
    }) {
        const endpoint = new TestEndpoint({ action, name, parameters })

        await endpoint.init()

        expect(endpoint.getAction()).to.equal(action)
        expect(endpoint.getName()).to.equal(name)
        expect(String(endpoint.getParameters())).to.equal(String(parameters))
        expect(endpoint.getResponse()).to.equal(response)
        expect(endpoint.getStatusCode()).to.equal(statusCode)
    }
})
