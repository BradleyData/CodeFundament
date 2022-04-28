import { Client } from "pg"
import { Postgres as Pg } from "../wrapper/Postgres"

export class Postgres {
    static async truncateDb(): Promise<boolean> {
        let result = true
        const tempdbName = "todeletefrom"

        const connectionInfo = Pg.connectionInfo
        try {
            await Pg.end()
        } catch {} // eslint-disable-line no-empty

        await dropThenCreate({
            client: new Client(connectionInfo),
            dbName: tempdbName,
        })
        await dropThenCreate({
            client: new Client({
                ...connectionInfo,
                database: tempdbName,
            }),
            dbName: connectionInfo.database,
        })
        await Pg.resetPool()

        return result

        async function dropThenCreate({
            client,
            dbName,
        }: {
            client: Client
            dbName: string
        }): Promise<void> {
            try {
                await client.connect()
                await client.query(`DROP DATABASE IF EXISTS ${dbName}`)
                await client.query(`CREATE DATABASE ${dbName}`)
            } catch {
                console.log(`Unable to drop/create ${dbName}.`)
                result = false
            }
            try {
                await client.end()
            } catch {} // eslint-disable-line no-empty
        }
    }
}
