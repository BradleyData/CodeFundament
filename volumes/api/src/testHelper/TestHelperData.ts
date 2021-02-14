export class TestHelperData {
    static randomInt(): number {
        const max = 100
        return this.randomIntWithMax({ max })
    }

    static randomIntWithMax({ max }: { max: number }): number {
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

                return allChar.charAt(
                    this.randomIntWithMax({ max: allChar.length })
                )
            })
            .join()
    }
}
