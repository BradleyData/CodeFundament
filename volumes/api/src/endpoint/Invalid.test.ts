import Endpoint from "./Invalid"

describe(Endpoint.name, () => {
    test.each([["delete"], ["get"], ["post"]])("%s", async (action: string) => {
        const highVersion = 50
        const endpoint = new Endpoint("", highVersion, action, "")

        await endpoint.init()

        expect(endpoint.getName()).toBe("Invalid")
        expect(endpoint.getVersion()).toBe(1)
    })
})
