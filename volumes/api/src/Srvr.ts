import Http from "http"

export default class {
    private readonly server: Http.Server

    constructor() {
        this.server = Http.createServer()
    }

    listen(port: string = "3000"): void {
        this.server.on(
            "request",
            (req: Http.IncomingMessage, res: Http.ServerResponse): void => {
                console.log(req)
                res.write("it's working")
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
