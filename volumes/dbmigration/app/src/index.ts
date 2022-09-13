import { Postgres } from "./wrapper/Postgres"
import { Srvr } from "./srvr/Srvr"

const srvr = new Srvr()
srvr.listen({ port: process.env.PORT })

const onExit = async ({ exitCode }: { exitCode: number }): Promise<void> => {
    await Postgres.end()
    process.exitCode = exitCode
    process.exit()
}

process.on("SIGINT", () =>
    srvr.shutdown({
        msg: "Got SIGINT (aka ctrl-c in docker).",
        onExit,
    })
)
process.on("SIGTERM", () =>
    srvr.shutdown({
        msg: "Got SIGTERM (docker container stop).",
        onExit,
    })
)
