import { Default as DefaultEndpoint } from "./endpoint/Default.v1"
import { Endpoint } from "./Endpoint"
import { EndpointFactory } from "./EndpointFactory"
import { Invalid as InvalidEndpoint } from "./endpoint/Invalid"
import { TestHelperData } from "./testHelper/TestHelperData"
import { mocked } from "ts-jest/utils"

jest.mock("./Endpoint")
jest.mock("./endpoint/Invalid")
jest.mock("./endpoint/Default.v1")

describe(EndpointFactory.name, () => {
    test("with invalid instanceof", async () => {
        expect.assertions(1)
        try {
            await EndpointFactory.createEndpoint({
                action: TestHelperData.randomString(),
                apiVersion: 1,
                name: "Default",
                parameters: {},
            })
        } catch (err) {
            expect(err.message).toBe("Invalid endpoint.")
        }
    })

    describe("with valid instanceof", () => {
        const endpoint = mocked(Endpoint, true)

        test("with valid version", async () => {
            const defaultEndpoint: Partial<typeof Endpoint> = mocked(
                DefaultEndpoint,
                true
            )
            defaultEndpoint.prototype = endpoint.prototype

            await EndpointFactory.createEndpoint({
                action: TestHelperData.randomString(),
                apiVersion: 1,
                name: "Default",
                parameters: {},
            })
        })

        test("with invalid version", async () => {
            const invalidEndpoint: Partial<typeof Endpoint> = mocked(
                InvalidEndpoint,
                true
            )
            invalidEndpoint.prototype = endpoint.prototype

            await EndpointFactory.createEndpoint({
                action: TestHelperData.randomString(),
                apiVersion: -1,
                name: "Default",
                parameters: {},
            })
        })
    })
})
