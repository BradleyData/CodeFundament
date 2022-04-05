import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import { Generator } from "./Generator"
import { expect } from "chai"
import { mockGraphQLResolveInfo } from "./testHelper/mock/GraphQLResolveInfo"

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    it("uses default values", () => {
        const generator = new Generator()

        const result = generator.generate()
        const resolve = result.resolve ?? (() => {}) // eslint-disable-line no-empty-function

        expect(result.resolve).to.not.be.undefined
        expect(result.type).to.not.be.undefined
        expect(result.args).to.be.undefined
        expect(resolve("", {}, "", mockGraphQLResolveInfo)).to.be.false
    })
})
