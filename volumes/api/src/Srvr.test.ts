import * as Fs from "fs"
import { Convert } from "./Convert"
import { EndpointFactory } from "./EndpointFactory"
import { Srvr } from "./Srvr"
import { TestHelperData } from "./testHelper/TestHelperData"

const mockPath = `${process.cwd()}/app/src/endpoint`
const mockDirectory = TestHelperData.randomString({ includeSymbols: false })
const mockDirectories = `${TestHelperData.randomString({
    includeSymbols: false,
})}/${TestHelperData.randomString({ includeSymbols: false })}`
const mockEndpoint = TestHelperData.randomString({ includeSymbols: false })
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
            const endpointName = TestHelperData.randomString()
            const endpointVersion = TestHelperData.randomInt()
            const urlParameters = `${TestHelperData.randomString({
                includeSymbols: false,
            })}/${TestHelperData.randomString({ includeSymbols: false })}`
            const convertedParameters = Convert.urlParametersToObject({
                urlParameters,
            })
            const rowsAffected = TestHelperData.randomInt()
            const response = `{Version: ${endpointVersion}}`
            const statusCode = TestHelperData.randomInt()
            const action = TestHelperData.randomString()
            const endpoint = {
                getAction: jest.fn().mockReturnValue(action),
                getApiVersion: jest.fn().mockReturnValue(endpointVersion),
                getName: jest.fn().mockReturnValue(endpointName),
                getParameters: jest.fn().mockReturnValue(convertedParameters),
                getResponse: jest.fn().mockReturnValue(response),
                getRowsAffected: jest.fn().mockReturnValue(rowsAffected),
                getStatusCode: jest.fn().mockReturnValue(statusCode),
            }
            EndpointFactory.createEndpoint = jest
                .fn()
                .mockResolvedValue(endpoint)

            srvr.listen()
            await mockServer.on.mock.calls[0][1](mockReq, mockRes)

            expect(onEventName).toBe("request")
            expect(EndpointFactory.createEndpoint).toBeCalledWith({
                action: "get",
                apiVersion: mockDefaultVersion,
                name: mockDefaultEndpoint,
                parameters: {},
            })
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
                JSON.stringify(convertedParameters)
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
            const port = TestHelperData.randomInt().toString()

            srvr.listen({ port })

            expect(srvr["server"].listen).toBeCalledWith(port)
        })
    })

    describe("shuts down", () => {
        const msg = TestHelperData.randomString()
        const onExit = jest.fn()

        test("cleanly", () => {
            srvr.shutdown({ msg, onExit })

            expect(mockInfo).toBeCalledWith(
                expect.stringContaining(msg),
                expect.anything()
            )
            expect(mockError).not.toBeCalled()
            expect(onExit).toBeCalledWith({ exitCode: 0 })
        })

        test("has error", () => {
            const err = new Error()
            closeError = err

            srvr.shutdown({ msg, onExit })

            expect(mockError).toBeCalledWith(err)
            expect(onExit).toBeCalledWith({ exitCode: 1 })
        })
    })

    describe("not given URL", () => {
        test("and with no action", () => {
            // eslint-disable-next-line no-undefined
            mockReq.method = undefined

            srvr.listen()

            expect(EndpointFactory.createEndpoint).toBeCalledWith({
                action: "get",
                apiVersion: expect.anything(),
                name: expect.anything(),
                parameters: expect.anything(),
            })
        })
    })

    describe("given URL", () => {
        const p1 = TestHelperData.randomString({ includeSymbols: false })
        const p2 = TestHelperData.randomString({ includeSymbols: false })
        const p3 = TestHelperData.randomString({ includeSymbols: false })
        const urlParameters = `${p1}/${p2}/${p3}`
        const convertedParameters = Convert.urlParametersToObject({
            urlParameters,
        })

        describe("with valid endpoint", () => {
            test("but no version", () => {
                mockReq.url = `/${mockEndpoint}/${urlParameters}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith({
                    action: expect.any(String),
                    apiVersion: mockMainVersion,
                    name: mockEndpoint,
                    parameters: convertedParameters,
                })
            })

            test("but no version or parameters", () => {
                mockReq.url = `/${mockEndpoint}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith({
                    action: expect.any(String),
                    apiVersion: mockMainVersion,
                    name: mockEndpoint,
                    parameters: {},
                })
            })

            test("and valid version", () => {
                mockReq.url = `/v${mockMinVersion}/${mockEndpoint}/${urlParameters}`

                srvr.listen()

                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPath}/${mockEndpoint}/${urlParameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPath}/${mockEndpoint}`
                )
                expect(EndpointFactory.createEndpoint).toBeCalledWith({
                    action: expect.any(String),
                    apiVersion: mockMinVersion,
                    name: mockEndpoint,
                    parameters: convertedParameters,
                })
            })

            test("and really high version", () => {
                const raiseVersionBy = 10
                mockReq.url = `/v${
                    mockMainVersion + raiseVersionBy
                }/${mockEndpoint}/${urlParameters}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith({
                    action: expect.any(String),
                    apiVersion: mockMainVersion,
                    name: mockEndpoint,
                    parameters: convertedParameters,
                })
            })

            test("and invalid version", () => {
                const invalidVersion = -1
                mockReq.method = "get"
                mockReq.url = `/v0/${mockEndpoint}/${urlParameters}`

                srvr.listen()

                expect(EndpointFactory.createEndpoint).toBeCalledWith({
                    action: expect.any(String),
                    apiVersion: invalidVersion,
                    name: "",
                    parameters: {},
                })
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
                mockReq.url = `/v0/${mockEndpoint}/${urlParameters}`

                srvr.listen()
                await mockServer.on.mock.calls[0][1](mockReq, mockRes)

                expect(mockLog).toBeCalledWith(
                    expect.stringMatching(/\(stack missing\)$/u)
                )
            })
        })

        describe("with endpoint in subdirectory", () => {
            test("one level deep", () => {
                mockReq.url = `/v${mockMinVersionWithDirectory}/${mockDirectory}/${mockEndpoint}/${urlParameters}`

                srvr.listen()

                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPathWithDirectory}/${mockEndpoint}/${urlParameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                expect(EndpointFactory.createEndpoint).toBeCalledWith({
                    action: expect.any(String),
                    apiVersion: mockMinVersionWithDirectory,
                    name: `${mockDirectory}/${mockEndpoint}`,
                    parameters: convertedParameters,
                })
            })

            test("two levels deep", () => {
                mockReq.url = `/v${mockMinVersionWithDirectory}/${mockDirectories}/${mockEndpoint}/${urlParameters}`

                srvr.listen()

                expect(Fs.readdirSync).toBeCalledWith(
                    `${mockPathWithDirectories}/${mockEndpoint}/${urlParameters
                        .split("/")
                        .slice(0, -1)
                        .join("/")}`
                )
                expect(EndpointFactory.createEndpoint).toBeCalledWith({
                    action: expect.any(String),
                    apiVersion: mockMinVersionWithDirectory,
                    name: `${mockDirectories}/${mockEndpoint}`,
                    parameters: convertedParameters,
                })
            })
        })
    })

    describe("version regex test", () => {
        test("regex starts at beginning of potential version", () => {
            mockReq.method = "get"
            mockReq.url = "/vv1"

            srvr.listen()

            expect(EndpointFactory.createEndpoint).toBeCalledWith({
                action: expect.any(String),
                apiVersion: expect.any(Number),
                name: expect.any(String),
                parameters: Convert.urlParametersToObject({
                    urlParameters: "vv1",
                }),
            })
        })

        test("regex goes to end of potential version", () => {
            mockReq.method = "get"
            mockReq.url = "/v1v"

            srvr.listen()

            expect(EndpointFactory.createEndpoint).toBeCalledWith({
                action: expect.any(String),
                apiVersion: expect.any(Number),
                name: expect.any(String),
                parameters: Convert.urlParametersToObject({
                    urlParameters: "v1v",
                }),
            })
        })
    })
})
