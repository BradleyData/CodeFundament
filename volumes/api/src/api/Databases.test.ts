// import { EnvironmentSetup } from "../../testHelper/EnvironmentSetup"
// import { Postgres as Pg } from "../../wrapper/Postgres"
// import { Postgres } from "./Postgres"
// import { QueryResult } from "pg"
// import Sinon from "sinon"
// import { TestHelperData } from "../../testHelper/TestHelperData"
// import { TestHelperPostgres } from "../../testHelper/TestHelperPostgres"
// import { expect } from "chai"

// EnvironmentSetup.initSinonChai()

// describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
//     const postgres = new Postgres()

//     /* eslint-disable no-unused-vars */
//     let query: Sinon.SinonStub<
//         [
//             {
//                 sql: string
//                 useResults?: ({
//                     queryResult,
//                 }: {
//                     queryResult: QueryResult<any>
//                 }) => void
//                 values: any
//             }
//         ],
//         Promise<number>
//     >
//     /* eslint-enable no-unused-vars */

//     beforeEach(() => {
//         query = Sinon.stub(Pg, "query")
//     })

//     afterEach(() => {
//         query.restore()
//     })

//     it("queries the database", async () => {
//         const message = /^Postgres .*$/u
//         const values = [Sinon.match(message)]

//         await postgres.IsWorking()

//         TestHelperPostgres.expectQueryExists({
//             queryStub: query,
//             queryType: "SELECT",
//             withValues: values,
//         })
//     })

//     it("returns true when messages match", async () => {
//         await postgres.IsWorking()
//         const message = query.firstCall.args[0].values[0]

//         const result = await checkMessage({ message })

//         expect(result).to.be.true
//     })

//     it("returns false when messages are different", async () => {
//         const message = TestHelperData.randomString()

//         const result = await checkMessage({ message })

//         expect(result).to.be.false
//     })

//     async function checkMessage({
//         message,
//     }: {
//         message: string
//     }): Promise<boolean> {
//         const queryResult = TestHelperPostgres.queryResultMock({
//             rows: [{ message }],
//         })

//         query.yieldsTo("useResults", { queryResult })
//         return await postgres.IsWorking()
//     }
// })
