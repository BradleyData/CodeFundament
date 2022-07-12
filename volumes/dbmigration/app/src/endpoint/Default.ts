import { Endpoint } from "../Endpoint"

class Default extends Endpoint {
    // eslint-disable-next-line no-empty-function
    protected async delete(): Promise<void> {}

    /* eslint-disable require-await */
    protected async get(): Promise<void> {
        this.response = "yup"
    }
    /* eslint-enable require-await */

    // eslint-disable-next-line no-empty-function
    protected async post(): Promise<void> {}
}

export { Default, Default as Endpoint }
