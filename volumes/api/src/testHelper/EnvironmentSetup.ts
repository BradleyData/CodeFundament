import Chai from "chai"
import SinonChai from "sinon-chai"

export class EnvironmentSetup {
    static initSinonChai() {
        Chai.use(SinonChai)
    }
}
