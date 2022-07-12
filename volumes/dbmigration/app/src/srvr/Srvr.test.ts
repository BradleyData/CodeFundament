import * as HttpUnwrapped from "http"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { Event } from "./Event"
import { Http } from "../wrapper/Http"
import Sinon from "sinon"
import { Srvr } from "./Srvr"
import { TestHelperData } from "../testHelper/TestHelperData"
import { expect } from "chai"

EnvironmentSetup.initSinonChai()

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    /* eslint-disable no-unused-vars */
    let stubError: Sinon.SinonStub
    let stubInfo: Sinon.SinonStub
    let stubServerClose: Sinon.SinonStub<
        [callback?: (err?: Error | undefined) => void]
    >
    let stubServerListen: Sinon.SinonStub<
        [handle: any, listeningListener?: () => void]
    >
    let stubServerOn: Sinon.SinonStub<
        [event: "listening", listener: () => void]
    >
    let stubServerOnRequest: Sinon.SinonStub
    /* eslint-enable no-unused-vars */

    before(() => {
        stubServerClose = Sinon.stub()
        stubServerListen = Sinon.stub()
        stubServerOn = Sinon.stub()
        Sinon.stub(Http, "createServer").returns(
            Sinon.createStubInstance(HttpUnwrapped.Server, {
                close: stubServerClose,
                listen: stubServerListen,
                on: stubServerOn,
            })
        )
        stubServerOnRequest = Sinon.stub(Event).onRequest
        stubError = Sinon.stub(console, "error")
        stubInfo = Sinon.stub(console, "info")
    })

    after(() => {
        Sinon.restore()
    })

    it("listens on default port", () => {
        const defaultPort = "3000"
        const srvr = new Srvr()

        srvr.listen()
        stubServerOn.callArg(1)

        expect(stubServerListen).to.be.calledWithExactly(defaultPort)
        expect(stubServerOn).to.be.calledWith("request")
        expect(stubServerOnRequest).to.be.called
    })

    describe("when shutting down", () => {
        const msg = TestHelperData.randomString()
        let exitCodeActual = TestHelperData.randomInt()
        /* eslint-disable require-await */
        const onExit = async ({
            exitCode,
        }: {
            exitCode: number
        }): Promise<void> => {
            exitCodeActual = exitCode
        }
        /* eslint-enable require-await */

        it("does so cleanly", () => {
            const exitCodeCorrect = 0
            const srvr = new Srvr()

            srvr.shutdown({ msg, onExit })
            stubServerClose.callArg(0)

            expect(stubInfo).to.be.calledWithMatch(msg, /.*/u)
            expect(stubError).not.to.be.called
            expect(exitCodeActual).to.equal(exitCodeCorrect)
        })

        it("throws an error", () => {
            const exitCodeCorrect = 1
            const srvr = new Srvr()

            srvr.shutdown({ msg, onExit })
            stubServerClose.callArgWith(0, new Error())

            expect(stubInfo).to.be.calledWithMatch(msg, /.*/u)
            expect(stubError).to.be.called
            expect(exitCodeActual).to.equal(exitCodeCorrect)
        })
    })
})
