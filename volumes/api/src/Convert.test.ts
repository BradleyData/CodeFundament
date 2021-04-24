import { Convert } from "./Convert"

describe(Convert.name, () => {
    describe("String to Integer", () => {
        /* eslint-disable no-magic-numbers */
        test.each([
            ["1", 1],
            ["-2", -2],
        ])("'%s'", (input: string, output: number) => {
            const convertedValue = Convert.stringToInteger({
                inputString: input,
            })

            expect(convertedValue).toStrictEqual(output)
        })

        test.each([[""], ["one"], ["2.3"]])("'%s'", (input: string) => {
            expect(() => {
                Convert.stringToInteger({ inputString: input })
            }).toThrow(Convert.errorNotAnInteger)
        })
        /* eslint-enable no-magic-numbers */

        test("Error message exists", () => {
            expect(Convert.errorNotAnInteger.message).toStrictEqual(
                expect.stringMatching(/[A-Z]+/u)
            )
        })
    })

    describe("URL Parameters to Object", () => {
        test.each([
            ["", {}],
            ["/", {}],
            ["one", { 0: "one" }],
            ["one=a", { one: "a" }],
        ])("'%s'", (input: string, output: object) => {
            const convertedValue = Convert.urlParametersToObject({
                urlParameters: input,
            })

            expect(convertedValue).toStrictEqual(output)
        })
    })
})
