import EndpointFactory from "./EndpointFactory"
import Srvr from "./Srvr"

const mockError = jest.spyOn(console, "error").mockImplementation()
const mockInfo = jest.spyOn(console, "info").mockImplementation()
// const mockLog = jest.spyOn(console, "log").mockImplementation()

jest.mock("fs", () => {
    return {
        readdirSync: jest.fn().mockReturnValue(["Default.v1.ts"]),
    }
})

jest.mock("http", () => {
    return {
        createServer: () => {
            return {
                close: function (
                    callback?: ((err?: Error | undefined) => void) | undefined
                ) {
                    if (typeof callback !== "undefined")
                        callback(this.closeError)
                },
                closeError: undefined, // eslint-disable-line no-undefined
                listen: jest.fn(),
                on: function (
                    eventName: string,
                    listener: (req: any, res: any) => void
                ) {
                    this.onEventName = eventName
                    listener(this.onReq, this.onRes)
                },
                onEventName: "",
                onReq: {},
                onRes: {
                    end: jest.fn(),
                    setHeader: jest.fn(),
                    write: jest.fn(),
                },
            }
        },
    }
})

describe("Srvr", () => {
    const srvr = new Srvr()
    const customFields: any = srvr["server"]

    describe("listens on", () => {
        const endpointName = "EndpointName"
        const endpointVersion = Math.floor(Math.random() * 50)
        const parameters = "endpoint/parameters"
        const rowsAffected = Math.floor(Math.random() * 50)
        test("default port", () => {
            const endpoint = {
                getAction: jest.fn(),
                getName: jest.fn().mockReturnValue(endpointName),
                getParameters: jest.fn().mockReturnValue(parameters),
                getResponse: jest.fn(),
                getRowsAffected: jest.fn().mockReturnValue(rowsAffected),
                getStatusCode: jest.fn(),
                getVersion: jest.fn().mockReturnValue(endpointVersion),
            }
            EndpointFactory.createEndpoint = jest.fn().mockReturnValue(endpoint)

            srvr.listen()
            expect(customFields.onEventName).toBe("request")
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Content-Type",
                "application/json; charset=utf-8"
            )
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Endpoint-Name",
                endpointName
            )
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Endpoint-Version",
                endpointVersion
            )
            // expect(customFields.onRes.setHeader).toBeCalledWith(
            //     "Requested-Action",
            //     "get"
            // )
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Parameters-Sent",
                parameters
            )
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Rows-Affected",
                rowsAffected
            )
            expect(customFields.onRes.end).toBeCalled()
            expect(srvr["server"].listen).toBeCalledWith("3000")
        })

        test("given port", () => {
            const port = "15"
            srvr.listen(port)
            expect(srvr["server"].listen).toBeCalledWith(port)
        })
    })

    describe("shuts down", () => {
        const msg = "test message"
        const onExit = jest.fn()

        test("cleanly", () => {
            srvr.shutdown(msg, onExit)
            expect(mockInfo).toBeCalledWith(
                expect.stringContaining(msg),
                expect.anything()
            )
            expect(mockError).not.toBeCalled()
            expect(onExit).toBeCalledWith(0)
        })

        it("has error", () => {
            const err = new Error()
            customFields.closeError = err

            srvr.shutdown(msg, onExit)
            expect(mockError).toBeCalledWith(err)
            expect(onExit).toBeCalledWith(1)
        })
    })
})
