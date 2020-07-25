import Endpoint from "./Default.v2"

describe("endpoints/Default/Default v2", () => {
    test.each([["delete"], ["get"], ["post"]])("%s", (action: string) => {
        const endpoint = new Endpoint("", 1, action, "")
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })
})
