import { Invalid as Endpoint } from "./Invalid"
import { TestHelperData } from "../testHelper/TestHelperData"

describe(Endpoint.name, () => {
    test.each([["delete"], ["get"], ["post"]])("%s", async (action: string) => {
        const apiVersion = TestHelperData.randomInt()
        const endpoint = new Endpoint({
            action,
            apiVersion,
            name: TestHelperData.randomString(),
            parameters: {},
        })

        await endpoint.init()

        expect(endpoint.getName()).toBe("Invalid")
        expect(endpoint.getApiVersion()).toBe(1)
    })
})
