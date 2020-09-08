import EndpointFactory from "./EndpointFactory"
import Fs from "fs"
import Srvr from "./Srvr"
import TestHelper from "./TestHelper"

const mockPath = `${process.cwd()}/app/src/endpoint`
const mockDirectory = "Directory"
const mockDirectories = "Director/ies"
const mockEndpoint = "Endpoint"
const mockPathWithDirectory = `${mockPath}/${mockDirectory}`
const mockPathWithDirectories = `${mockPath}/${mockDirectories}`
const mockMinVersion = 1
const mockMainVersion = 3
const mockMinVersionWithDirectory = 2
const mockMainVersionWithDirectory = 5

const mockDefaultEndpoint = "Default" // Changing this will break tests.
const mockDefaultVersion = 1

const mockError = jest.spyOn(console, "error").mockImplementation()
const mockInfo = jest.spyOn(console, "info").mockImplementation()
const mockLog = jest.spyOn(console, "log").mockImplementation()

jest.mock("fs", () => {
    return {
        readdirSync: jest.fn().mockImplementation((filePath: string) => {
            const testPath =
                filePath.slice(-1) === "/" ? filePath.slice(0, -1) : filePath

            if (testPath === mockPath) {
                return [
                    `${mockDefaultEndpoint}.v${mockDefaultVersion}.ts`,
                    `${mockEndpoint}.v${mockMinVersion}.ts`,
                    `${mockEndpoint}.v${mockMainVersion}.ts`,
                ]
            }
            if (
                testPath === mockPathWithDirectory ||
                testPath === mockPathWithDirectories
            ) {
                return [
                    `${mockEndpoint}.v${mockMinVersionWithDirectory}.ts`,
                    `${mockEndpoint}.v${mockMainVersionWithDirectory}.ts`,
                ]
            }
            // eslint-disable-next-line no-magic-numbers
            if (testPath.length % 2 === 0) 
                throw new Error()
            return []
        }),
    }
})

let closeError: Error
let onEventName = ""
const mockReq: { method: string | undefined; url: string | undefined } = {
    // eslint-disable-next-line no-undefined
    method: undefined,
    // eslint-disable-next-line no-undefined
    url: undefined,
}
const mockRes = {
    end: jest.fn(),
    setHeader: jest.fn(),
    statusCode: 0,
    write: jest.fn(),
}
const mockServer = {
    close: function (
        // eslint-disable-next-line no-unused-vars
        callback?: ((err?: Error | undefined) => void) | undefined
    ) {
        if (typeof callback !== "undefined") 
            callback(closeError)
    },
    listen: jest.fn(),
    on: jest.fn(function (
        eventName: string,
        // eslint-disable-next-line no-unused-vars
        listener: (req: any, res: any) => void
    ) {
        onEventName = eventName
        listener(mockReq, mockRes)
    }),
}

jest.mock("http", () => {
    return {
        createServer: () => mockServer,
    }
})

describe(Srvr.name, () => {
    const srvr = new Srvr()
    EndpointFactory.createEndpoint = jest.fn()

    describe("listens on", () => {
        test("default port", async () => {
            const endpointName = "EndpointName"
            const endpointVersion = TestHelper.randomInt()
            const parameters = "endpoint/parameters"
            const rowsAffected = TestHelper.randomInt()
            const response = `{Version: ${endpointVersion}}`
            const statusCode = TestHelper.randomInt()
            const action = "action"
            const endpoint = {
                getAction: jest.fn().mockReturnValue(action),
                getName: jest.fn().mockReturnValue(endpointName),
                getParameters: jest.fn().mockReturnValue(parameters),
                getResponse: jest.fn().mockReturnValue(response),
                getRowsAffected: jest.fn().mockReturnValue(rowsAffected),
                getStatusCode: jest.fn().mockReturnValue(statusCode),
                getVersion: jest.fn().mockReturnValue(endpointVersion),
            }
            EndpointFactory.createEndpoint = jest
                .fn()
                .mockResolvedValue(endpoint)

            srvr.listen()
            await mockServer.on.mock.calls[0][1](mockReq, mockRes)

            expect(onEventName).toBe("request")
            expect(EndpointFactory.createEndpoint).toBeCalledWith(
                mockDefaultEndpoint,
                mockDefaultVersion,
                "get",
                ""
            )
            expect(mockRes.statusCode).toBe(statusCode)
            expect(mockRes.setHeader).toBeCalledWith(
                "Content-Type",
                "application/json; charset=utf-8"
            )
            expect(mockRes.setHeader).toBeCalledWith(
                "Endpoint-Name",
                endpointName
            )
            expect(mockRes.setHeader).toBeCalledWith(
                "Endpoint-Version",
                endpointVersion
            )
            expect(mockRes.setHeader).toBeCalledWith("Requested-Action", action)
            expect(mockRes.setHeader).toBeCalledWith(
                "Parameters-Sent",
                parameters
            )
            expect(mockRes.setHeader).toBeCalledWith(
                "Rows-Affected",
                rowsAffected
            )
            expect(mockRes.write).toBeCalledWith(response)
            expect(mockRes.end).toBeCalled()
            expect(srvr["server"].listen).toBeCalledWith("3000")
        })

        test("given port", () => {
            const port = TestHelper.randomInt().toString()

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

        test("has error", () => {
            const err = new Error()
            closeError = err

            srvr.shutdown(msg, onExit)

            expect(mockError).toBeCalledWith(err)
            expect(onExit).toBeCalledWith(1)
        })
    })

    describe("not given URL", () => {
        test("and with no action", () => {
            // eslint-disable-next-line no-undefined
            mockReq.method = undefined

            srvr.listen()

            expect(EndpointFactory.createEndpoint).toBeCalledWith(
                expect.anything(),
                expect.anything(),
                "get",
                expect.anything()
            )
        })
    })

    describe("given URL", () => {
        const parameters = "para/mete/rs"

        describe("with valid endpoint", () => {
            test("but no version", () => {
                mockReq.url = `/${mockEndpoint}/${parameters}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    mockEndpoint,
                    mockMainVersion,
                    expect.any(String),
                    parameters
                )
            })

            test("but no version or parameters", () => {
                mockReq.url = `/${mockEndpoint}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    mockEndpoint,
                    mockMainVersion,
                    expect.any(String),
                    ""
                )
            })

            test("and valid version", () => {
                mockReq.url = `/v${mockMinVersion}/${mockEndpoint}/${parameters}`

                srvr.listen()

                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPath}/${mockEndpoint}/${parameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPath}/${mockEndpoint}`
                )
                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    mockEndpoint,
                    mockMinVersion,
                    expect.any(String),
                    parameters
                )
            })

            /**
             * When this uses parameters with slashes, Stryker seems to ignore it.
             */
            test("and really high version", () => {
                const customParameters = "parameters"
                const raiseVersionBy = 10
                mockReq.url = `/v${
                    mockMainVersion + raiseVersionBy
                }/${mockEndpoint}/${customParameters}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    mockEndpoint,
                    mockMainVersion,
                    expect.any(String),
                    customParameters
                )
            })

            test("and invalid version", () => {
                const invalidVersion = -1
                mockReq.method = "get"
                mockReq.url = `/v0/${mockEndpoint}/${parameters}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    "",
                    invalidVersion,
                    expect.any(String),
                    ""
                )
                expect(mockLog).toBeCalledWith(`action: ${mockReq.method}`)
                expect(mockLog).toBeCalledWith(`url: ${mockReq.url}`)
                expect(mockLog).toBeCalledWith(
                    expect.stringMatching(/^Error:.*version.*undefined/u)
                )
            })

            test("error without error.stack", async () => {
                mockRes.setHeader = jest.fn().mockImplementation(() => {
                    // eslint-disable-next-line no-throw-literal
                    throw true
                })
                mockReq.url = `/v0/${mockEndpoint}/${parameters}`

                srvr.listen()
                await mockServer.on.mock.calls[0][1](mockReq, mockRes)

                expect(mockLog).toBeCalledWith(
                    expect.stringMatching(/\(stack missing\)$/u)
                )
            })
        })

        describe("with endpoint in subdirectory", () => {
            test("one level deep", () => {
                mockReq.url = `/v${mockMinVersionWithDirectory}/${mockDirectory}/${mockEndpoint}/${parameters}`

                srvr.listen()

                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPathWithDirectory}/${mockEndpoint}/${parameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    `${mockDirectory}/${mockEndpoint}`,
                    mockMinVersionWithDirectory,
                    expect.any(String),
                    parameters
                )
            })

            test("two levels deep", () => {
                mockReq.url = `/v${mockMinVersionWithDirectory}/${mockDirectories}/${mockEndpoint}/${parameters}`

                srvr.listen()

                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPathWithDirectories}/${mockEndpoint}/${parameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    `${mockDirectories}/${mockEndpoint}`,
                    mockMinVersionWithDirectory,
                    expect.any(String),
                    parameters
                )
            })
        })
    })
})
