import { Invalid as Endpoint } from "./Invalid"

describe(Endpoint.name, () => {
    test.each([["delete"], ["get"], ["post"]])("%s", async (action: string) => {
        const highVersion = 500
        const endpoint = new Endpoint({
            action,
            name: "",
            parameters: {},
            version: highVersion,
        })

        await endpoint.init()

        expect(endpoint.getName()).toBe("Invalid")
        expect(endpoint.getVersion()).toBe(1)
    })
})
