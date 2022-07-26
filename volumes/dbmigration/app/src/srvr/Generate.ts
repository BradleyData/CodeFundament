import { Convert } from "../Convert"
import { Endpoint } from "../Endpoint"
import { EndpointFactory } from "../EndpointFactory"
import { Fs } from "../wrapper/Fs"
import { Log } from "./Log"

export class Generate {
    private action: string
    private url: string
    private name: string
    private parameters: { [key: string]: string }

    constructor({ action, url }: { action: string; url: string }) {
        this.action = action
        this.url = url

        const urlElements = url.split("/").filter((element) => element !== "")
        const firstParameterPosition = this.getFirstParameterPosition({
            urlElements,
        })
        const path = `${urlElements
            .slice(0, Math.max(0, firstParameterPosition - 1))
            .join("/")}/`
        const name =
            firstParameterPosition === 0
                ? "Default"
                : urlElements[firstParameterPosition - 1]
        this.name = `${path}${name}`
        this.parameters = Convert.urlParametersToObject({
            urlParameters: urlElements.slice(firstParameterPosition).join("/"),
        })
    }

    async endpoint(): Promise<Endpoint> {
        try {
            return await EndpointFactory.createEndpoint({
                action: this.action,
                name: this.name,
                parameters: this.parameters,
            })
        } catch (error) {
            Log.error({ action: this.action, error, url: this.url })

            return await EndpointFactory.createEndpoint({
                action: this.action,
                name: "",
                parameters: {},
            })
        }
    }

    getName(): string {
        return this.name
    }

    private getFirstParameterPosition({
        urlElements,
    }: {
        urlElements: string[]
    }): number {
        // Stryker disable next-line UpdateOperator: Generates an infinite loop
        for (let position = urlElements.length; position >= 0; position--) {
            if (
                fileExists({
                    filename: urlElements[position],
                    filepath: urlElements.slice(0, position).join("/"),
                })
            )
                return position + 1
        }

        return 0

        function fileExists({
            filename,
            filepath,
        }: {
            filename: string
            filepath: string
        }): boolean {
            try {
                const files = Fs.readDirSync({
                    path: `${process.cwd()}/app/src/endpoint/${filepath}`,
                }).filter((file) => file.match(`^${filename}.[jt]s$`))
                return files.length !== 0
            } catch (error) {
                return false
            }
        }
    }
}
