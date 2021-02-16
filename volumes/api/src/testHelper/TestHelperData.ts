export class TestHelperData {
    static randomInt(): number
    // eslint-disable-next-line no-unused-vars
    static randomInt({ max }: { max?: number }): number
    // eslint-disable-next-line no-magic-numbers
    static randomInt({ max = 100 }: { max?: number } = {}): number {
        return Math.floor(Math.random() * max)
    }

    static randomString(): string {
        const length = 10

        return [...Array(length)]
            .map(() => {
                const charUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                const charLower = "abcdefghijklmnopqrstuvwxyz"
                const charDigit = "0123456789"
                const charOther = " '\"!@#$%^&*()-_=+~\\|;:{}[],.<>/?`"
                const allChar = charUpper + charLower + charDigit + charOther

                return allChar.charAt(this.randomInt({ max: allChar.length }))
            })
            .join()
    }
}
