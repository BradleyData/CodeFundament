import { Postgres } from "./Postgres"
import { expect } from "chai"

describe(Postgres.name, () => {
    it("has a single boolean with a default", () => {
        const postgres = new Postgres()

        expect(postgres.Test).to.be.false
    })
})
