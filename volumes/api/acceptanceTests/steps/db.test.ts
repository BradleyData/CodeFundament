import { Then, When } from "@cucumber/cucumber"
import { Postgres } from "../../src/graphql/resolver/Postgres"
import { expect } from "chai"

let postgres: Postgres

When("the API attempts to connect to postgres", async () => {
    postgres = new Postgres()
    await postgres.IsWorking()
})

Then("the postgres connection is successful", () => {
    expect(postgres.Postgres().IsWorking).to.be.true
})
