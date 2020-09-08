import Endpoint from "./Default.v3"

describe(Endpoint.name, () => {
    test.each([["delete"], ["get"], ["post"]])("%s", async (action: string) => {
        const endpoint = new Endpoint("", 1, action, "")

        await endpoint.init()

        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })
})
