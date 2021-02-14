import { Endpoint } from "./Endpoint"

export class EndpointFactory {
    static async createEndpoint({
        name,
        version,
        action,
        parameters,
    }: {
        name: string
        version: number
        action: string
        parameters: { [key: string]: string }
    }): Promise<Endpoint> {
        const invalidVersion = -1
        const path =
            version === invalidVersion
                ? "./endpoint/Invalid"
                : `./endpoint/${name}.v${version}`
        const SpecificEndpoint = require(path).Endpoint
        const endpoint = new SpecificEndpoint({
            action,
            name,
            parameters,
            version,
        })

        if (!(endpoint instanceof Endpoint))
            throw new Error("Invalid endpoint.")

        await endpoint.init()

        return endpoint
    }
}
