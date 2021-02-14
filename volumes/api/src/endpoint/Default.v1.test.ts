import { Default as Endpoint } from "./Default.v1"
import { TestHelperData } from "../testHelper/TestHelperData"

describe(Endpoint.name, () => {
    test.each([["delete"], ["get"], ["post"]])("%s", async (action: string) => {
        const endpoint = new Endpoint({
            action,
            name: "",
            parameters: {},
            version: TestHelperData.randomInt(),
        })

        await endpoint.init()

        expect(endpoint.getRowsAffected()).toBe(0)
        expect(endpoint.getResponse()).toBe("{}")
    })
})
