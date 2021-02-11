import { Convert } from "./Convert"

describe(Convert.name, () => {
    test.each([
        ["", {}],
        ["/", {}],
        ["one", { 0: "one" }],
        ["one=a", { one: "a" }],
    ])("'%s'", (input: string, output: object) => {
        const convertedValue = Convert.urlParametersToObject(input)

        expect(convertedValue).toStrictEqual(output)
    })
})
