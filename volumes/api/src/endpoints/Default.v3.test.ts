import Endpoint from "./Default.v3"

describe("endpoints/Default v3", () => {
    test.each([["delete"], ["get"], ["post"]])("%s", (action: string) => {
        const endpoint = new Endpoint("", 1, action, "")
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })
})
