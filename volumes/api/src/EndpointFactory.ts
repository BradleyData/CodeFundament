import Endpoint from "./Endpoint"

export default class EndpointFactory {
    static async createEndpoint(
        name: string,
        version: number,
        action: string,
        parameters: string
    ): Promise<Endpoint> {
        const invalidVersion = -1
        const path =
            version === invalidVersion
                ? "./endpoint/Invalid"
                : `./endpoint/${name}.v${version}`
        const SpecificEndpoint = require(path).default
        const endpoint = new SpecificEndpoint(name, version, action, parameters)

        if (!(endpoint instanceof Endpoint))
            throw new Error("Invalid endpoint.")

        await endpoint.init()

        return endpoint
    }
}
