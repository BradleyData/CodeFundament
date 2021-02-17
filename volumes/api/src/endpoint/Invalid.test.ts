import { Invalid as Endpoint } from "./Invalid"
import { TestHelperData } from "../testHelper/TestHelperData"

describe(Endpoint.name, () => {
    test.each([["delete"], ["get"], ["post"]])("%s", async (action: string) => {
        const highVersion = 500
        const endpoint = new Endpoint({
            action,
            name: TestHelperData.randomString(),
            parameters: {},
            version: highVersion,
        })

        await endpoint.init()

        expect(endpoint.getName()).toBe("Invalid")
        expect(endpoint.getVersion()).toBe(1)
    })
})
