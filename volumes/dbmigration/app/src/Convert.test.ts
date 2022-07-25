import { Convert } from "./Convert"
import { EnvironmentSetup } from "./testHelper/EnvironmentSetup"
import { expect } from "chai"

describe(EnvironmentSetup.getSuiteName({ __filename }), () => {
    describe("String to Integer", () => {
        describe("successes", () => {
            it("1", () => testConvert({ inputString: "1", outputExpected: 1 }))
            it("-2", () =>
                testConvert({ inputString: "-2", outputExpected: -2 }))

            function testConvert({
                inputString,
                outputExpected,
            }: {
                inputString: string
                outputExpected: number
            }) {
                const result = Convert.stringToInteger({ inputString })

                expect(result).to.equal(outputExpected)
            }
        })

        describe("failures", () => {
            it("empty string", () => testConvert({ inputString: "" }))
            it("one", () => testConvert({ inputString: "one" }))
            it("2.3", () => testConvert({ inputString: "2.3" }))

            function testConvert({ inputString }: { inputString: string }) {
                const result = () => Convert.stringToInteger({ inputString })

                expect(result).to.throw(/Not.*number/u)
            }
        })
    })

    describe("URL Parameters to Object", () => {
        it("empty string", () => testConvert({ input: "", outputExpected: {} }))
        it("/", () => testConvert({ input: "/", outputExpected: {} }))
        it("/one", () =>
            testConvert({ input: "/one", outputExpected: { 0: "one" } }))
        it("one=a", () =>
            testConvert({ input: "one=a", outputExpected: { one: "a" } }))

        function testConvert({
            input,
            outputExpected,
        }: {
            input: string
            outputExpected: object
        }) {
            const result = Convert.urlParametersToObject({
                urlParameters: input,
            })

            expect(result).to.eql(outputExpected)
        }
    })
})
