import * as Fs from "fs"
import * as Http from "http"
import { Convert } from "./Convert"
import { Endpoint } from "./Endpoint"
import { EndpointFactory } from "./EndpointFactory"

export class Srvr {
    private readonly server: Http.Server

    constructor() {
        this.server = Http.createServer()
    }

    listen(): void
    // eslint-disable-next-line no-unused-vars
    listen({ port }: { port?: string }): void
    listen({ port = "3000" }: { port?: string } = {}): void {
        this.server.on(
            "request",
            async (
                req: Http.IncomingMessage,
                res: Http.ServerResponse
            ): Promise<void> => {
                const action = req.method ?? "get"
                const url = req.url ?? ""

                try {
                    const endpoint = await this.createEndpoint({ action, url })
                    res.statusCode = endpoint.getStatusCode()
                    res.setHeader(
                        "Content-Type",
                        "application/json; charset=utf-8"
                    )
                    res.setHeader("Endpoint-Name", endpoint.getName())
                    res.setHeader("Endpoint-Version", endpoint.getVersion())
                    res.setHeader("Requested-Action", endpoint.getAction())
                    res.setHeader(
                        "Parameters-Sent",
                        JSON.stringify(endpoint.getParameters())
                    )
                    res.setHeader("Rows-Affected", endpoint.getRowsAffected())
                    res.write(endpoint.getResponse())
                } catch (error) {
                    this.logError({ action, error, url })
                }
                res.end()
            }
        )
        this.server.listen(port)
    }

    shutdown({
        msg,
        onExit,
    }: {
        msg: string
        // eslint-disable-next-line no-unused-vars
        onExit: ({ exitCode }: { exitCode: number }) => void
    }): void {
        let exitCode = 0

        console.info(`${msg} Graceful shutdown `, new Date().toISOString())
        this.server.close((error) => {
            if (error) {
                console.error(error)
                exitCode = 1
            }
            onExit({ exitCode })
        })
    }

    async createEndpoint({
        action,
        url,
    }: {
        action: string
        url: string
    }): Promise<Endpoint> {
        let endpoint: Endpoint

        try {
            const urlElements = url
                .split("/")
                .filter((element) => element !== "")

            const hasVersion = /^v[0-9]+$/u.test(urlElements[0])

            const sansVersion = urlElements.slice(hasVersion ? 1 : 0)

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

            const parameters = Convert.urlParametersToObject({
                urlParameters: sansVersion
                    .slice(firstParameterPosition)
                    .join("/"),
            })

            const version = getVersion()
            if (version === 0) 
                throw new Error("Endpoint version undefined.")

            endpoint = await EndpointFactory.createEndpoint({
                action,
                name: `${endpointPath}${endpointName}`,
                parameters,
                version,
            })

            function getFirstParameterPosition(): number {
                for (
                    let position = sansVersion.length;
                    position >= 0;
                    position--
                ) {
                    if (
                        fileExists({
                            filename: sansVersion[position],
                            filepath: sansVersion.slice(0, position).join("/"),
                        })
                    )
                        return position + 1
                }

                return 0

                function fileExists({
                    filename,
                    filepath,
                }: {
                    filename: string
                    filepath: string
                }): boolean {
                    try {
                        const files = Fs.readdirSync(
                            `${process.cwd()}/app/src/endpoint/${filepath}`
                        ).filter((file) =>
                            file.match(`^${filename}.v[0-9]+.[jt]s$`)
                        )
                        return files.length !== 0
                    } catch (error) {
                        return false
                    }
                }
            }

            function getVersion(): number {
                const actualVersions = Fs.readdirSync(
                    `${process.cwd()}/app/src/endpoint/${endpointPath}`
                )
                    .filter((file) =>
                        file.match(`^${endpointName}.v[0-9]+.[jt]s$`)
                    )
                    .map((file) => {
                        const fileElements = file.split(".")
                        const versionIndex = 2
                        return parseInt(
                            fileElements[
                                fileElements.length - versionIndex
                            ].substring(1),
                            10
                        )
                    })
                    .sort()

                if (!hasVersion)
                    return actualVersions[actualVersions.length - 1]

                const requestedVersion = parseInt(
                    urlElements[0].substring(1),
                    10
                )

                if (actualVersions.includes(requestedVersion))
                    return requestedVersion

                const allVersions = actualVersions.concat(requestedVersion)

                const requestedVersionIndex = allVersions
                    .sort((a, b) => a - b)
                    .indexOf(requestedVersion)
                return allVersions[requestedVersionIndex - 1] ?? 0
            }
        } catch (error) {
            this.logError({ action, error, url })

            const invalidVersion = -1
            endpoint = await EndpointFactory.createEndpoint({
                action,
                name: "",
                parameters: {},
                version: invalidVersion,
            })
        }

        return endpoint
    }

    private logError({
        action,
        error,
        url,
    }: {
        action: string
        error: Error
        url: string
    }): void {
        console.log(`action: ${action}`)
        console.log(`url: ${url}`)
        console.log(
            error.stack ?? `${error.name}: ${error.message} (stack missing)`
        )
    }
}
