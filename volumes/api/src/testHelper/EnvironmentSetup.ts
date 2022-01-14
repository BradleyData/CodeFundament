import Chai from "chai"
import SinonChai from "sinon-chai"

export class EnvironmentSetup {
    static getSuiteName({ __filename }: { __filename: string }): string {
        return __filename.replace(/.test.ts$/u, ".ts")
    }

    static initSinonChai() {
        Chai.use(SinonChai)
    }
}
