import Srvr from "./Srvr"

const mockError = jest.spyOn(console, "error").mockImplementation()
const mockInfo = jest.spyOn(console, "info").mockImplementation()
// const mockLog = jest.spyOn(console, "log").mockImplementation()

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
                onReq: jest.fn(),
                onRes: {
                    end: jest.fn(),
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
        test("default port", () => {
            srvr.listen()
            expect(customFields.onEventName).toBe("request")
            // expect(mockLog).toBeCalledWith(customFields.onReq)
            // expect(customFields.onRes.write).toBeCalledWith(/^Default/)
            expect(customFields.onRes.write).toBeCalled()
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
