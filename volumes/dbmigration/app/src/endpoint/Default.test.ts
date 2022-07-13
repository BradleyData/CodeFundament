import { Default } from "./Default"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { expect } from "chai"

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    it("generates content", async () => {
        const endpoint = new Default({
            action: "get",
            name: "",
            parameters: {},
        })

        await endpoint.init()

        expect(endpoint.getResponse()).to.equal("yup")
    })
})
