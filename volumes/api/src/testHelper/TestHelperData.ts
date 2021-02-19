export class TestHelperData {
    static randomInt(): number
    static randomInt({
        /* eslint-disable no-unused-vars */
        includeNegatives,
        max,
    }: /* eslint-enable no-unused-vars */
    {
        includeNegatives?: boolean
        max?: number
    }): number
    static randomInt({
        includeNegatives = false,
        // eslint-disable-next-line no-magic-numbers
        max = 100,
    }: { includeNegatives?: boolean; max?: number } = {}): number {
        const mayMakeNegative =
            includeNegatives && this.randomInt({ max: 1 }) === 1 ? -1 : 1
        return Math.floor(Math.random() * (max + 1)) * mayMakeNegative
    }

    static randomString(): string
    static randomString({
        /* eslint-disable no-unused-vars */
        includeDigits,
        includeLowers,
        includeSymbols,
        includeUppers,
        length,
    }: /* eslint-enable no-unused-vars */
    {
        includeDigits?: boolean
        includeLowers?: boolean
        includeSymbols?: boolean
        includeUppers?: boolean
        length?: number
    }): string
    static randomString({
        includeDigits = true,
        includeLowers = true,
        includeSymbols = true,
        includeUppers = true,
        length,
    }: {
        includeDigits?: boolean
        includeLowers?: boolean
        includeSymbols?: boolean
        includeUppers?: boolean
        length?: number
    } = {}): string {
        const min = 3
        const max = 10
        const stringLength = length ?? min + this.randomInt({ max: max - min })

        return [...Array(stringLength)]
            .map(() => {
                const charUpper = includeUppers
                    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                    : ""
                const charLower = includeLowers
                    ? "abcdefghijklmnopqrstuvwxyz"
                    : ""
                const charDigit = includeDigits ? "0123456789" : ""
                const charOther = includeSymbols
                    ? " '\"!@#$%^&*()-_=+~\\|;:{}[],.<>/?`"
                    : ""
                const allChar = `${charUpper}${charLower}${charDigit}${charOther}`

                return allChar.charAt(this.randomInt({ max: allChar.length }))
            })
            .join("")
    }
}
