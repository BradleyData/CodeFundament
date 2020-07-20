import Http from "http"
import Endpoint from "./Endpoint"

export default class {
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
                let version = "v1"
                let parameters = url.split("/")
                parameters.shift()
                if (parameters[0].match(/^v[0-9]+$/))
                    version = parameters.shift() ?? ""
                try {
                    const Endpoint2 = require(`./endpoints/Default.${version}`)
                        .default
                    const endpoint = new Endpoint2(action, parameters.join("/"))
                    if (!(endpoint instanceof Endpoint))
                        throw new Error("Invalid endpoint.")
                    res.write(endpoint.getName() + "\n")
                    res.write(endpoint.getVersion().toString() + "\n")
                    res.write(endpoint.getRowsAffected().toString() + "\n")
                    res.write(endpoint.getResponse() + "\n")
                    res.write(endpoint.getAction() + "\n")
                    res.write(endpoint.getParameters() + "\n")
                } catch (error) {
                    if (error instanceof Error) {
                        console.log(error.stack ?? "")
                    }
                }
                res.end()
            }
        )
        this.server.listen(port)
    }

    shutdown(msg: string, onExit: (exitCode: number) => void): void {
        let exitCode = 0

        console.info(`${msg} Graceful shutdown `, new Date().toISOString())
        this.server.close((err) => {
            if (err) {
                console.error(err)
                exitCode = 1
            }
            onExit(exitCode)
        })
    }
}
