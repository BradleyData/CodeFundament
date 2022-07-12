import { Convert } from "../Convert"
import { Endpoint } from "../Endpoint"
import { EndpointFactory } from "../EndpointFactory"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Fs } from "../wrapper/Fs"
import { Generate } from "./Generate"
import { Log } from "./Log"
import Sinon from "sinon"
import { TestHelperData } from "../testHelper/TestHelperData"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    let stubConvert: Sinon.SinonStub
    let stubEndpointFactory: Sinon.SinonStub
    let stubFs: Sinon.SinonStub

    const action = TestHelperData.randomString()

    beforeEach(() => {
        stubConvert = Sinon.stub(Convert, "urlParametersToObject")
        stubEndpointFactory = Sinon.stub(
            EndpointFactory,
            "createEndpoint"
        ).resolves(Sinon.createStubInstance(Endpoint))
        stubFs = Sinon.stub(Fs, "readDirSync")
    })

    afterEach(() => {
        Sinon.restore()
    })

    describe("generates a default endpoint", () => {
        beforeEach(() => {
            stubFs.returns([])
        })

        it("given an empty url", async () => {
            const url = ""
            const name = "/Default"

            await testGenerateEndpoint({ name, url, urlParameters: url })

            expect(stubFs).to.be.calledWith({
                path: Sinon.match(/.*\/endpoint\//u),
            })
        })

        it("given a no-slash url", async () => {
            const url = TestHelperData.randomString({
                includeDigits: false,
                includeSymbols: false,
            })
            const name = "/Default"

            await testGenerateEndpoint({ name, url, urlParameters: url })
        })

        it("given a single-slash url", async () => {
            const first = TestHelperData.randomString({
                includeDigits: false,
                includeSymbols: false,
            })
            const second = TestHelperData.randomString({
                includeDigits: false,
                includeSymbols: false,
            })
            const url = `${first}/${second}`
            const name = "/Default"

            await testGenerateEndpoint({ name, url, urlParameters: url })
        })

        it("given a url ending in a slash", async () => {
            const urlParameters = TestHelperData.randomString({
                includeDigits: false,
                includeSymbols: false,
            })
            const url = `${urlParameters}/`
            const name = "/Default"

            await testGenerateEndpoint({ name, url, urlParameters })
        })
    })

    describe("generates a non-default endpoint", () => {
        const endpointName = TestHelperData.randomString({
            includeDigits: false,
            includeSymbols: false,
        })

        it("given the endpoint name", async () => {
            stubFs.returns([`${endpointName}.ts`])
            const urlParameters = ""
            const url = endpointName
            const name = `/${endpointName}`

            await testGenerateEndpoint({ name, url, urlParameters })
        })

        it("given directories, an endpoint name, and parameters", async () => {
            const directoryName1 = TestHelperData.randomString({
                includeDigits: false,
                includeSymbols: false,
            })
            const directoryName2 = TestHelperData.randomString({
                includeDigits: false,
                includeSymbols: false,
            })
            const parameter1 = TestHelperData.randomString({
                includeSymbols: false,
            })
            const parameter2 = TestHelperData.randomString({
                includeSymbols: false,
            })
            const urlParameters = `${parameter1}/${parameter2}`
            const url = `${directoryName1}/${directoryName2}/${endpointName}/${parameter1}/${parameter2}`
            const name = `${directoryName1}/${directoryName2}/${endpointName}`
            stubFs.onFirstCall().returns([directoryName2])
            stubFs.returns([`${endpointName}.ts`])

            await testGenerateEndpoint({ name, url, urlParameters })

            expect(stubFs).to.be.calledWith({
                path: Sinon.match(/\/(?:.*\/){8,}[A-Za-z0-9]*/u),
            })
        })
    })

    describe("handles errors", () => {
        it("in file search", async () => {
            stubFs.throws()
            const url = ""
            const name = "/Default"
            const generate = new Generate({ action, url })

            await generate.endpoint()

            expect(generate.getName()).to.equal(name)
        })

        it("generating endpoint", async () => {
            Sinon.stub(Log, "error")
            stubEndpointFactory.onFirstCall().throws()
            const url = ""
            const name = ""
            const generate = new Generate({ action, url })

            await generate.endpoint()

            expect(stubEndpointFactory).to.be.calledWith({
                action,
                name,
                parameters: {},
            })
        })
    })

    async function testGenerateEndpoint({
        name,
        url,
        urlParameters,
    }: {
        name: string
        url: string
        urlParameters: string
    }) {
        const generate = new Generate({ action, url })

        await generate.endpoint()

        expect(generate.getName()).to.equal(name)
        expect(stubConvert).to.be.calledWith({ urlParameters: urlParameters })
    }
})
