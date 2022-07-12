// import { Branch } from "./Branch"
// import { Git } from "./wrapperUnshared/Git"
import { Postgres } from "./wrapper/Postgres"
import { Srvr } from "./srvr/Srvr"

// express.get("/", async (req, res) => {
//     // eslint-disable-next-line no-array-constructor
//     const content = new Array<string>().concat(
//         await Branch.runTests({ branchType: Git.branchType.production }),
//         await Branch.runTests()
//     )
//     res.send(contentToString())

//     function contentToString(): string {
//         return content.reduce((current, addend) => {
//             return `${current}<br>${addend}`
//         }, "")
//     }
// })

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
