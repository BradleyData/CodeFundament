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

    static stubClass({
        className,
        fileName,
        overrides,
    }: {
        className: string
        fileName: string
        overrides: object
    }): Sinon.SinonStub {
        const StubbedFile = require(`../${fileName}`)
        const stub = Sinon.createStubInstance(StubbedFile[className], overrides)
        return Sinon.stub(StubbedFile, className).returns(stub)
    }
}
