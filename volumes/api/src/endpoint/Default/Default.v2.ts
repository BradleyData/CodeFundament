import { Endpoint } from "../../Endpoint"

class Default extends Endpoint {
    // eslint-disable-next-line no-empty-function
    protected async delete(): Promise<void> {}

    // eslint-disable-next-line no-empty-function
    protected async get(): Promise<void> {}

    // eslint-disable-next-line no-empty-function
    protected async post(): Promise<void> {}
}

export { Default, Default as Endpoint }
