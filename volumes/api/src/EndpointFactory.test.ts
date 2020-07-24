import DefaultEndpoint from "./endpoints/Default.v1"
import Endpoint from "./Endpoint"
import EndpointFactory from "./EndpointFactory"
import InvalidEndpoint from "./endpoints/Invalid"
import { mocked } from "ts-jest/utils"

jest.mock("./Endpoint")
jest.mock("./endpoints/Invalid")
jest.mock("./endpoints/Default.v1")

describe("EndpointFactory", () => {
    test("with invalid instanceof", () => {
        expect(() => {
            EndpointFactory.createEndpoint("Default", 1, "", "")
        }).toThrow("Invalid endpoint")
    })

    describe("with valid instanceof", () => {
        const endpoint = mocked(Endpoint, true)

        test("with valid version", () => {
            const defaultEndpoint = mocked(DefaultEndpoint, true)
            defaultEndpoint.prototype = endpoint.prototype
            EndpointFactory.createEndpoint("Default", 1, "", "")
        })

        test("with invalid version", () => {
            const invalidEndpoint = mocked(InvalidEndpoint, true)
            invalidEndpoint.prototype = endpoint.prototype
            EndpointFactory.createEndpoint("Default", -1, "", "")
        })
    })
})
