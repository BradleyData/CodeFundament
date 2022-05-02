import { Branch } from "./Branch"
import Express from "express"
import { Git } from "./wrapperUnshared/Git"
import { Postgres } from "./wrapper/Postgres"
import compression from "compression"

const defaultPort = 3000

runServer()

function runServer() {
    const express = Express()
    express.use(compression())
    express.get("/", async (req, res) => {
        // eslint-disable-next-line no-array-constructor
        const content = new Array<string>().concat(
            await Branch.runTests({ branchType: Git.branchType.production }),
            await Branch.runTests()
        )
        res.send(contentToString())

        function contentToString(): string {
            return content.reduce((current, addend) => {
                return `${current}<br>${addend}`
            }, "")
        }
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
