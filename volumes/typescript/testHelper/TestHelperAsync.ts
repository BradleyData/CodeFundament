import { expect } from "chai"

export class TestHelperAsync {
    static async expectThrow({
        fn,
        message,
    }: {
        fn: CallableFunction
        message: string
    }) {
        let savedError = null

        try {
            await fn()
        } catch (error) {
            savedError = error
        }

        expect(savedError).to.be.an("Error")
        if (savedError instanceof Error)
            expect(savedError.message).to.contain(message)
        else 
            expect(savedError).to.contain(message)
    }
}
