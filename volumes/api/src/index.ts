import Srvr from "./Srvr"

const srvr = new Srvr()
srvr.listen(process.env.PORT)

process.on("SIGINT", () =>
    srvr.shutdown("Got SIGINT (aka ctrl-c in docker).", onExit)
)
process.on("SIGTERM", () =>
    srvr.shutdown("Got SIGTERM (docker container stop).", onExit)
)

function onExit(exitCode: number): void {
    process.exitCode = exitCode
    process.exit()
}
