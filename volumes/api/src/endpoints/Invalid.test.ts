import Endpoint from "./Invalid"

describe("endpoints/Invalid", () => {
    test.each([["delete"], ["get"], ["post"]])("%s", (action: string) => {
        const highVersion = 5
        const endpoint = new Endpoint("", highVersion, action, "")
        expect(endpoint.getName()).toBe("Invalid")
        expect(endpoint.getVersion()).toBe(1)
    })
})
