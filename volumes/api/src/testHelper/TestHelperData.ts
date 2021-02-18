export class TestHelperData {
    static randomInt(): number
    // eslint-disable-next-line no-unused-vars
    static randomInt({ max }: { max?: number }): number
    // eslint-disable-next-line no-magic-numbers
    static randomInt({ max = 100 }: { max?: number } = {}): number {
        return Math.floor(Math.random() * max)
    }

    static randomString(): string
    static randomString({
        /* eslint-disable no-unused-vars */
        includeDigit,
        includeLower,
        includeOther,
        includeUpper,
        length,
    }: /* eslint-enable no-unused-vars */
    {
        includeDigit?: boolean
        includeLower?: boolean
        includeOther?: boolean
        includeUpper?: boolean
        length?: number
    }): string
    static randomString({
        includeDigit = true,
        includeLower = true,
        includeOther = true,
        includeUpper = true,
        length,
    }: {
        includeDigit?: boolean
        includeLower?: boolean
        includeOther?: boolean
        includeUpper?: boolean
        length?: number
    } = {}): string {
        const min = 3
        const max = 10
        const stringLength = length ?? min + this.randomInt({ max: max - min })

        return [...Array(stringLength)]
            .map(() => {
                const charUpper = includeUpper
                    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                    : ""
                const charLower = includeLower
                    ? "abcdefghijklmnopqrstuvwxyz"
                    : ""
                const charDigit = includeDigit ? "0123456789" : ""
                const charOther = includeOther
                    ? " '\"!@#$%^&*()-_=+~\\|;:{}[],.<>/?`"
                    : ""
                const allChar = `${charUpper}${charLower}${charDigit}${charOther}`

                return allChar.charAt(this.randomInt({ max: allChar.length }))
            })
            .join("")
    }
}
