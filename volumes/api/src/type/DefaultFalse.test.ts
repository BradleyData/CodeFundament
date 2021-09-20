import { DefaultFalse } from "./DefaultFalse"
import { EnvironmentSetup } from "../testHelper/EnvironmentSetup"
import { expect } from "chai"

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    it("has a single boolean with a default", () => {
        const defaultFalse = new DefaultFalse()

        expect(defaultFalse.value).to.be.false
    })
})
