import Endpoint from "./Endpoint"
import Fs from "fs"
import Http from "http"

export default class Srvr {
    private readonly server: Http.Server

    constructor() {
        this.server = Http.createServer()
    }

    listen(port: string = "3000"): void {
        this.server.on(
            "request",
            (req: Http.IncomingMessage, res: Http.ServerResponse): void => {
                const action = req.method ?? "get"
                const url = req.url ?? "/"

                try {
                    sendResponse(createEndpoint())
                } catch (error) {
                    logError(error)
                }
                res.end()

                function sendResponse(endpoint: Endpoint): void {
                    res.statusCode = endpoint.getStatusCode()
                    res.setHeader(
                        "Content-Type",
                        "application/json; charset=utf-8"
                    )
                    res.setHeader("Endpoint-Name", endpoint.getName())
                    res.setHeader("Endpoint-Version", endpoint.getVersion())
                    res.setHeader("Requested-Action", endpoint.getAction())
                    res.setHeader("Parameters-Sent", endpoint.getParameters())
                    res.setHeader("Rows-Affected", endpoint.getRowsAffected())
                    res.write(endpoint.getResponse())
                }

                function createEndpoint(): Endpoint {
                    let SpecificEndpoint: any
                    let endpoint: Endpoint

                    try {
                        const urlElements = url
                            .split("/")
                            .filter((element) => element !== "")

                        const hasVersion =
                            urlElements.length > 0 &&
                            /^v[0-9]+$/u.test(urlElements[0])

                        const sansVersion = urlElements.slice(
                            hasVersion ? 1 : 0
                        )

                        const firstParameterPosition = getFirstParameterPosition()

                        const minForPathToExist = 2

                        const endpointPath =
                            firstParameterPosition < minForPathToExist
                                ? ""
                                : `${sansVersion
                                    .slice(0, firstParameterPosition - 1)
                                    .join("/")}/`

                        const endpointName =
                            firstParameterPosition === 0
                                ? "Default"
                                : sansVersion[firstParameterPosition - 1]

                        const parameters = sansVersion
                            .slice(firstParameterPosition)
                            .join("/")

                        const version = getVersion()
                        if (version === 0)
                            throw new Error("Endpoint version undefined.")

                        SpecificEndpoint = require(`./endpoints/${endpointPath}${endpointName}.v${version}`)
                            .default

                        endpoint = new SpecificEndpoint(
                            `${endpointPath}${endpointName}`,
                            version,
                            action,
                            parameters
                        )

                        function getFirstParameterPosition(): number {
                            if (sansVersion.length === 0) 
                                return 0

                            if (sansVersion.length === 1)
                            {if (fileExists("", sansVersion[0])) 
                                return 1}

                            for (
                                let position = sansVersion.length - 1;
                                position > 0;
                                position--
                            )
                            {if (
                                fileExists(
                                    sansVersion
                                        .slice(0, position)
                                        .join("/"),
                                    sansVersion[position]
                                )
                            )
                                return position + 1}

                            if (fileExists("", sansVersion[0])) 
                                return 1

                            return 0

                            function fileExists(
                                filepath: string,
                                filename: string
                            ): boolean {
                                try {
                                    const files = Fs.readdirSync(
                                        `${process.cwd()}/app/src/endpoints/${filepath}`
                                    ).filter((file) =>
                                        file.match(
                                            `^${filename}.v[0-9]+.[jt]s$`
                                        )
                                    )
                                    return files.length !== 0
                                } catch (error) {
                                    return false
                                }
                            }
                        }

                        function getVersion(): number {
                            const parsedVersion = (() => {
                                const requestedVersion = urlElements[0]

                                const actualVersions = Fs.readdirSync(
                                    `${process.cwd()}/app/src/endpoints/${endpointPath}`
                                )
                                    .filter((file) =>
                                        file.match(
                                            `^${endpointName}.v[0-9]+.[jt]s$`
                                        )
                                    )
                                    .map(
                                        (file) =>
                                            (file.match(/\.v[0-9]+\.[jt]s$/u) ??
                                                "")[0].split(".")[1]
                                    )
                                    .sort()

                                if (!hasVersion) {
                                    return actualVersions[
                                        actualVersions.length - 1
                                    ]
                                }

                                const allVersions = actualVersions.concat(
                                    requestedVersion
                                )
                                const sansDuplicates = new Set(allVersions)
                                if (
                                    actualVersions.length ===
                                    sansDuplicates.size
                                )
                                    return requestedVersion

                                const requestedVersionIndex = allVersions
                                    .sort()
                                    .indexOf(requestedVersion)
                                return (
                                    allVersions[requestedVersionIndex - 1] ??
                                    "v0"
                                )
                            })()

                            return parseInt(parsedVersion.substr(1), 10)
                        }
                    } catch (error) {
                        logError(error)
                        SpecificEndpoint = require("./endpoints/Invalid")
                            .default

                        endpoint = new SpecificEndpoint("", 1, action, "")
                    }

                    if (!(endpoint instanceof Endpoint))
                        throw new Error("Invalid endpoint.")

                    return endpoint
                }

                function logError(error: Error): void {
                    console.log(`action: ${action}`)
                    console.log(`url: ${url}`)
                    console.log(error.stack ?? "")
                }
            }
        )
        this.server.listen(port)
    }

    shutdown(msg: string, onExit: (exitCode: number) => void): void {
        let exitCode = 0

        console.info(`${msg} Graceful shutdown `, new Date().toISOString())
        this.server.close((error) => {
            if (error) {
                console.error(error)
                exitCode = 1
            }
            onExit(exitCode)
        })
    }
}
