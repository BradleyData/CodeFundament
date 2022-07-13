import { Endpoint } from "./Endpoint"

export class EndpointFactory {
    static async createEndpoint({
        action,
        name,
        parameters,
    }: {
        action: string
        name: string
        parameters: { [key: string]: string }
    }): Promise<Endpoint> {
        const path = `./endpoint/${name}`
        const SpecificEndpoint = require(path).Endpoint
        const endpoint = new SpecificEndpoint({
            action,
            name,
            parameters,
        })

        if (!(endpoint instanceof Endpoint))
            throw new Error("Invalid endpoint.")

        await endpoint.init()

        return endpoint
    }
}
