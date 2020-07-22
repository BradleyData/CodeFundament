import Endpoint from "./Endpoint"

export default class EndpointFactory {
    static createEndpoint(
        name: string,
        version: number,
        action: string,
        parameters: string
    ): Endpoint {
        const invalidVersion = -1
        const path =
            version === invalidVersion
                ? "./endpoints/Invalid"
                : `./endpoints/${name}.v${version}`
        const SpecificEndpoint = require(path).default
        const endpoint = new SpecificEndpoint(name, version, action, parameters)

        if (!(endpoint instanceof Endpoint))
            throw new Error("Invalid endpoint.")

        return endpoint
    }
}
