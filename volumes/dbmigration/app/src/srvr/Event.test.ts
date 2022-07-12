import * as Http from "http"
import { Endpoint } from "../Endpoint"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Event } from "./Event"
// import { Generate } from "./Generate"
import { Log } from "./Log"
import Sinon from "sinon"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    let stubLog: Sinon.SinonStub

    let request: Http.IncomingMessage
    let response: Http.ServerResponse

    beforeEach(() => {
        stubLog = Sinon.stub(Log, "error")

        request = Sinon.createStubInstance(Http.IncomingMessage)
        response = Sinon.createStubInstance(Http.ServerResponse)
    })

    afterEach(() => {
        Sinon.restore()
    })

    it("responds to a request", async () => {
        const stubGenerate = EnvironmentSetup.stubClass({
            className: "Generate",
            fileName: "srvr/Generate.ts",
            overrides: {
                endpoint: Sinon.createStubInstance(Endpoint, {
                    getAction: "",
                    getName: "",
                    getParameters: {},
                    getResponse: "",
                    getStatusCode: 0,
                }),
            },
        })

        await Event.onRequest({ request, response })

        expect(stubGenerate).to.be.calledWith({
            action: "get",
            url: "",
        })
        expect(response.setHeader).to.be.calledWithMatch(/.*Name.*/u)
        expect(response.setHeader).to.be.calledWithMatch(/.*Action.*/u)
        expect(response.setHeader).to.be.calledWithMatch(/.*Param.*/u)
        expect(stubLog).to.not.be.called
    })

    it("has an error", async () => {
        EnvironmentSetup.stubClass({
            className: "Generate",
            fileName: "srvr/Generate.ts",
            overrides: {},
        })

        await Event.onRequest({ request, response })

        expect(stubLog).to.be.called
    })
})
