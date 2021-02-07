import DefaultEndpoint from "./endpoint/Default.v1"
import Endpoint from "./Endpoint"
import EndpointFactory from "./EndpointFactory"
import InvalidEndpoint from "./endpoint/Invalid"
import { mocked } from "ts-jest/utils"

jest.mock("./Endpoint")
jest.mock("./endpoint/Invalid")
jest.mock("./endpoint/Default.v1")

describe(EndpointFactory.name, () => {
    test("with invalid instanceof", async () => {
        expect.assertions(1)
        try {
            await EndpointFactory.createEndpoint("Default", 1, "", "")
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

            await EndpointFactory.createEndpoint("Default", 1, "", "")
        })

        test("with invalid version", async () => {
            const invalidEndpoint: Partial<typeof Endpoint> = mocked(
                InvalidEndpoint,
                true
            )
            invalidEndpoint.prototype = endpoint.prototype

            await EndpointFactory.createEndpoint("Default", -1, "", "")
        })
    })
})
