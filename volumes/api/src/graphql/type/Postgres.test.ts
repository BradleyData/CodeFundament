import { EnvironmentSetup } from "../../testHelper/EnvironmentSetup"
import { Postgres } from "./Postgres"
import { expect } from "chai"

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    it("has a single boolean with a default", () => {
        const postgres = new Postgres()

        expect(postgres.Test).to.be.false
    })
})
