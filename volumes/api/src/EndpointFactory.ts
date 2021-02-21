import { Endpoint } from "./Endpoint"

export class EndpointFactory {
    static async createEndpoint({
        action,
        apiVersion,
        name,
        parameters,
    }: {
        action: string
        apiVersion: number
        name: string
        parameters: { [key: string]: string }
    }): Promise<Endpoint> {
        const invalidVersion = -1
        const path =
            apiVersion === invalidVersion
                ? "./endpoint/Invalid"
                : `./endpoint/${name}.v${apiVersion}`
        const SpecificEndpoint = require(path).Endpoint
        const endpoint = new SpecificEndpoint({
            action,
            apiVersion,
            name,
            parameters,
        })

        if (!(endpoint instanceof Endpoint))
            throw new Error("Invalid endpoint.")

        await endpoint.init()

        return endpoint
    }
}
