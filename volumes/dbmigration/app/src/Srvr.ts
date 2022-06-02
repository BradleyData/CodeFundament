import Http from "http"

export class Srvr {
    private readonly server: Http.Server

    constructor() {
        this.server = Http.createServer()
    }

    listen(): void
    /* eslint-disable no-unused-vars */
    listen({ port }: { port?: string }): void
    /* eslint-enable no-unused-vars */
    listen({ port = "3000" }: { port?: string } = {}): void {
        this.server.on(
            "request",
            (req: Http.IncomingMessage, res: Http.ServerResponse): void => {
                try {
                    res.statusCode = 200
                    res.write("server working")
                } catch (error) {
                    const e = error as Error
                    console.log(
                        e.stack ?? `${e.name}: ${e.message} (stack missing)`
                    )
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
        /* eslint-disable no-unused-vars */
        onExit: ({ exitCode }: { exitCode: number }) => Promise<void>
        /* eslint-enable no-unused-vars */
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
}
