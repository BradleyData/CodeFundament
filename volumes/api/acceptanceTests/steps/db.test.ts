import { Then, When } from "@cucumber/cucumber"
import { Database } from "../../src/api/Database"
import { expect } from "chai"

let database: Database
let result: boolean

When("the API attempts to connect to the database", async () => {
    database = new Database()
    result = await database.isWorking()
})

Then("the database connection is successful", () => {
    expect(result).to.be.true
})
