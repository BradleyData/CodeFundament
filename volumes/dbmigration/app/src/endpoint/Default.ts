import { Endpoint } from "../Endpoint"
import { Fs } from "../wrapper/Fs"

class Default extends Endpoint {
    // eslint-disable-next-line no-empty-function
    protected async delete(): Promise<void> {}

    /* eslint-disable require-await */
    protected async get(): Promise<void> {
        const file = "/home/node/app/src/html/index.html"
        this.response = Fs.readFileSync({ file })
    }
    /* eslint-enable require-await */

    // eslint-disable-next-line no-empty-function
    protected async post(): Promise<void> {}
}

export { Default, Default as Endpoint }
