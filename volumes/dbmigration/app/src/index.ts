import { Branch } from "./Branch"
import Express from "express"
import { Postgres } from "./wrapper/Postgres"
import compression from "compression"

const defaultPort = 3000

runServer()

function runServer() {
    const express = Express()
    express.use(compression())
    express.get("/", async (req, res) => {
        res.send(await Branch.runTests())
    })
    const server = express.listen(process.env.PORT ?? defaultPort)

    process.on("SIGINT", () =>
        onExit({ msg: "Got SIGINT (aka ctrl-c in docker)." })
    )
    process.on("SIGTERM", () =>
        onExit({ msg: "Got SIGTERM (docker container stop)." })
    )

    async function onExit({ msg }: { msg: string }): Promise<void> {
        await server.close(() => {
            console.info(`${msg} Graceful shutdown `, new Date().toISOString())
        })
        await Postgres.end()
        process.exitCode = 0
        process.exit()
    }
}
