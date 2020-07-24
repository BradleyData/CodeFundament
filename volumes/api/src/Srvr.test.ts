import EndpointFactory from "./EndpointFactory"
import Fs from "fs"
import Srvr from "./Srvr"

const mockPath = `${process.cwd()}/app/src/endpoints`
const mockDirectory = "Directory"
const mockDirectories = "Director/ies"
const mockEndpoint = "Endpoint"
const mockPathWithDirectory = `${mockPath}/${mockDirectory}`
const mockPathWithDirectories = `${mockPath}/${mockDirectories}`
const mockMinVersion = 1
const mockMainVersion = 3
const mockMinVersionWithDirectory = 2
const mockMainVersionWithDirectory = 5
const mockInvalidVersion = -1
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
                // eslint-disable-next-line no-undefined
                closeError: undefined,
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
    EndpointFactory.createEndpoint = jest.fn()

    describe("listens on", () => {
        test("default port", () => {
            const maxRandomInt = 50
            const endpointName = "EndpointName"
            const endpointVersion = Math.floor(Math.random() * maxRandomInt)
            const parameters = "endpoint/parameters"
            const rowsAffected = Math.floor(Math.random() * maxRandomInt)
            const response = `{Version: ${endpointVersion}}`
            const statusCode = 404
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
            EndpointFactory.createEndpoint = jest.fn().mockReturnValue(endpoint)

            srvr.listen()
            expect(customFields.onEventName).toBe("request")
            expect(EndpointFactory.createEndpoint).toBeCalledWith(
                mockDefaultEndpoint,
                mockDefaultVersion,
                "get",
                ""
            )
            expect(customFields.onRes.statusCode).toBe(statusCode)
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
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Requested-Action",
                action
            )
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Parameters-Sent",
                parameters
            )
            expect(customFields.onRes.setHeader).toBeCalledWith(
                "Rows-Affected",
                rowsAffected
            )
            expect(customFields.onRes.write).toBeCalledWith(response)
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

        test("has error", () => {
            const err = new Error()
            customFields.closeError = err

            srvr.shutdown(msg, onExit)
            expect(mockError).toBeCalledWith(err)
            expect(onExit).toBeCalledWith(1)
        })
    })

    describe("not given URL", () => {
        test("and with no action", () => {
            // eslint-disable-next-line no-undefined
            customFields.onReq.method = undefined

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
                customFields.onReq.url = `/${mockEndpoint}/${parameters}`

                srvr.listen()
                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    mockEndpoint,
                    mockMainVersion,
                    expect.any(String),
                    parameters
                )
            })

            test("but no version or parameters", () => {
                customFields.onReq.url = `/${mockEndpoint}`

                srvr.listen()
                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    mockEndpoint,
                    mockMainVersion,
                    expect.any(String),
                    ""
                )
            })

            test("and valid version", () => {
                customFields.onReq.url = `/v${mockMinVersion}/${mockEndpoint}/${parameters}`

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
                customFields.onReq.url = `/v${
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
                customFields.onReq.method = "get"
                customFields.onReq.url = `/v0/${mockEndpoint}/${parameters}`

                srvr.listen()
                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    "",
                    mockInvalidVersion,
                    expect.any(String),
                    ""
                )
                expect(mockLog).toBeCalledWith(
                    `action: ${customFields.onReq.method}`
                )
                expect(mockLog).toBeCalledWith(`url: ${customFields.onReq.url}`)
                expect(mockLog).toBeCalledWith(
                    expect.stringMatching(/^Error:.*version.*undefined/u)
                )
            })

            test("error without error.stack", () => {
                customFields.onRes.setHeader = jest
                    .fn()
                    .mockImplementation(() => {
                        // eslint-disable-next-line no-throw-literal
                        throw true
                    })
                customFields.onReq.url = `/v0/${mockEndpoint}/${parameters}`

                srvr.listen()
                expect(mockLog).toBeCalledWith(
                    expect.stringMatching(/\(stack missing\)$/u)
                )
            })
        })

        describe("with endpoint in subdirectory", () => {
            test("one level deep", () => {
                customFields.onReq.url = `/v${mockMinVersionWithDirectory}/${mockDirectory}/${mockEndpoint}/${parameters}`

                srvr.listen()
                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPathWithDirectory}/${mockEndpoint}/${parameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                // expect(Fs.readdirSync).not.toBeCalledWith(`${mockPath}`)
                expect(EndpointFactory.createEndpoint).toBeCalledWith(
                    `${mockDirectory}/${mockEndpoint}`,
                    mockMinVersionWithDirectory,
                    expect.any(String),
                    parameters
                )
            })

            test("two levels deep", () => {
                customFields.onReq.url = `/v${mockMinVersionWithDirectory}/${mockDirectories}/${mockEndpoint}/${parameters}`

                srvr.listen()
                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPathWithDirectories}/${mockEndpoint}/${parameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                // expect(Fs.readdirSync).not.toBeCalledWith(`${mockPath}`)
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
