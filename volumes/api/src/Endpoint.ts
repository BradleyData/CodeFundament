class Endpoint {
    protected name: string
    protected version: number
    protected readonly action: string
    protected readonly parameters: string
    protected rowsAffected = 0
    protected response = "{}"
    private statusCode: Endpoint.StatusCode

    constructor(
        name: string,
        version: number,
        action: string,
        parameters: string
    ) {
        this.name = name
        this.version = version
        this.action = action.toUpperCase()
        this.parameters = parameters
        this.statusCode = 0
    }

    public async init() {
        switch (this.action) {
            case "DELETE":
                this.statusCode = Endpoint.StatusCode.noContent
                await this.delete()
                break
            case "GET":
                this.statusCode = Endpoint.StatusCode.ok
                await this.get()
                break
            case "POST":
                this.statusCode = Endpoint.StatusCode.created
                await this.post()
                break
            default:
                this.statusCode = Endpoint.StatusCode.badRequest
                this.invalidAction()
                break
        }
    }

    private invalidAction(): void {
        this.statusCode = Endpoint.StatusCode.badRequest
        this.rowsAffected = 0
        this.response = "{}"
    }

    protected async delete(): Promise<void> {
        await this.invalidAction()
    }

    protected async get(): Promise<void> {
        await this.invalidAction()
    }

    protected async post(): Promise<void> {
        await this.invalidAction()
    }

    public getAction(): string {
        return this.action
    }

    public getName(): string {
        return this.name
    }

    public getParameters(): string {
        return this.parameters
    }

    public getResponse(): string {
        return this.response
    }

    public getRowsAffected(): number {
        return this.rowsAffected
    }

    public getStatusCode(): number {
        return this.statusCode
    }

    public getVersion(): number {
        return this.version
    }
}

/* eslint-disable no-magic-numbers, no-redeclare, no-shadow, no-unused-vars */
namespace Endpoint {
    export enum StatusCode {
        ok = 200,
        created = 201,
        noContent = 204,
        badRequest = 400,
    }
}
/* eslint-enable no-magic-numbers, no-redeclare, no-unused-vars */

export default Endpoint
