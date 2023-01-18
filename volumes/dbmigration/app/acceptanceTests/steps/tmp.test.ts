import { Fs } from "../../src/wrapperUnshared/Fs"
import { Given, Then, When } from "@cucumber/cucumber"
import { expect } from "chai"

Given("a schema {string} exists", function (schemaName: string) {
    Fs.touch({file: `/home/node/migrations/${schemaName}.sql`})
})

When("updating the schema {string}", function (schemaName: string) {
    expect(schemaName).to.be.string

    return "pending"
})

Then(
    "the schema {string} is copied from the repository",
    function (schemaName: string) {
        expect(Fs.compare({file1: '/home/node/migrations/schemabranchpoint.sql', file2: '/home/node/migrations/schemabranchpoint.sql'})).to.be.true
        expect(Fs.compare({file1: '/home/node/migrations/schema.sql', file2: '/home/node/migrations/schemabranchpoint.sql'})).to.be.false

        return "pending"
    }
)

Then("all migrations are applied in order", function () {
    // Write code here that turns the phrase above into concrete actions
    return "pending"
})
