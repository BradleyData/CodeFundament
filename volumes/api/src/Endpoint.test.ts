import Endpoint from "./Endpoint"

const rowsAffected = 15
const response = "the response"

class AllActions extends Endpoint {
    private setup(): void {
        this.rowsAffected = rowsAffected
        this.response = response
    }
    protected delete(): void {
        this.setup()
    }
    protected get(): void {
        this.setup()
    }
    protected post(): void {
        this.setup()
    }
}

class NoActions extends Endpoint {}

class TestDefaultResponse extends Endpoint {
    // eslint-disable-next-line no-empty-function
    protected get(): void {}
}

describe("Endpoint", () => {
    const maxRandomInt = 10
    const name = "EndpointName"
    const version = Math.floor(Math.random() * maxRandomInt)
    const parameters = "parameters"

    describe.each([
        ["delete", Endpoint.StatusCode.noContent],
        ["get", Endpoint.StatusCode.ok],
        ["post", Endpoint.StatusCode.created],
    ])("%s", (action: string, statusCode: number) => {
        test("with actions defined", () => {
            const endpoint = new AllActions(name, version, action, parameters)
            expect(endpoint.getName()).toBe(name)
            expect(endpoint.getStatusCode()).toBe(statusCode)
            expect(endpoint.getRowsAffected()).toBe(rowsAffected)
            expect(endpoint.getResponse()).toBe(response)
        })

        test("without actions defined", () => {
            const endpoint = new NoActions(name, version, action, parameters)
            expect(endpoint.getName()).toBe(name)
            expect(endpoint.getStatusCode()).toBe(
                Endpoint.StatusCode.badRequest
            )
            expect(endpoint.getRowsAffected()).toBe(0)
            expect(endpoint.getResponse()).toBe("{}")
        })
    })

    test("invalid action", () => {
        const endpoint = new AllActions(
            name,
            version,
            "invalid action",
            parameters
        )
        expect(endpoint.getName()).toBe(name)
        expect(endpoint.getStatusCode()).toBe(Endpoint.StatusCode.badRequest)
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })

    test("default response", () => {
        const endpoint = new TestDefaultResponse(
            name,
            version,
            "get",
            parameters
        )
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })
})
