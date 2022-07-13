import { Generate } from "./Generate"
import { Http } from "../wrapper/Http"
import { Log } from "./Log"

export class Event {
    static async onRequest({
        request,
        response,
    }: {
        request: Http.IncomingMessage
        response: Http.ServerResponse
    }): Promise<void> {
        const action = request.method ?? "get"
        const url = request.url ?? ""

        try {
            const endpoint = await new Generate({ action, url }).endpoint()
            response.statusCode = endpoint.getStatusCode()
            response.setHeader("Endpoint-Name", endpoint.getName())
            response.setHeader("Requested-Action", endpoint.getAction())
            response.setHeader(
                "Parameters-Sent",
                JSON.stringify(endpoint.getParameters())
            )
            response.write(endpoint.getResponse())
        } catch (error) {
            Log.error({ action, error, url })
        }
        response.end()
    }
}
