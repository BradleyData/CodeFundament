import { Async } from "./testHelper/Async"
import { EndpointFactory } from "./EndpointFactory"
import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import Sinon from "sinon"
import { TestHelperData } from "./testHelper/TestHelperData"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    const endpointSettings = {
        action: TestHelperData.randomString(),
        name: "Default",
        parameters: {},
    }

    before(() => {
        EnvironmentSetup.stubClass({
            className: "Default",
            fileName: "endpoint/Default",
            overrides: {},
        })
    })

    after(() => {
        Sinon.restore()
    })

    it("returns an Endpoint with valid instanceof", async () => {
        const endpoint = await EndpointFactory.createEndpoint(endpointSettings)

        expect(endpoint).to.exist
    })

    it("throws exception with invalid instanceof", async () => {
        EnvironmentSetup.stubClass({
            className: "Endpoint",
            fileName: "Endpoint",
            overrides: {},
        })

        await Async.expectThrow({
            fn: () => EndpointFactory.createEndpoint(endpointSettings),
            message: "Invalid",
        })
    })
})
