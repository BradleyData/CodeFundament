import Chai from "chai"
import Sinon from "sinon"
import SinonChai from "sinon-chai"

export class EnvironmentSetup {
    static getSuiteName({ __filename }: { __filename: string }): string {
        return __filename.replace(/.test.ts$/u, ".ts")
    }

    static initSinonChai() {
        Chai.use(SinonChai)
    }

    static mockClass({
        className,
        fileName,
        overrides,
    }: {
        className: string
        fileName: string
        overrides: object
    }) {
        const MockedFile = require(`../${fileName}`)
        const stub = Sinon.createStubInstance(MockedFile[className], overrides)
        Sinon.stub(MockedFile, className).returns(stub)
    }
}
