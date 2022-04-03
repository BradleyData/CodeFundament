import "reflect-metadata" // eslint-disable-line import/no-unassigned-import
import Express from "express"
import { Postgres } from "./wrapper/Postgres"
import { Schema } from "./Schema"
import compression from "compression"
import { graphqlHTTP } from "express-graphql"
import { printSchema } from "graphql"
import { writeFile } from "fs"

const defaultPort = 3000

runServer()

function runServer() {
    const schema = new Schema().generate()
    if (process.env.NODE_ENV === "development")
        writeFile("app/src/schema2.gql", printSchema(schema), () => {}) // eslint-disable-line no-empty-function

    const express = Express()
    express.use(compression())
    express.use(
        "/",
        graphqlHTTP({
            graphiql: process.env.NODE_ENV === "development",
            schema,
        })
    )
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
