class Endpoint {
    protected name: string
    protected apiVersion: number
    protected readonly action: string
    protected readonly parameters: { [key: string]: string }
    protected rowsAffected = 0
    protected response = "{}"
    private statusCode: StatusCode

    constructor({
        action,
        name,
        parameters,
        apiVersion,
    }: {
        action: string
        name: string
        parameters: { [key: string]: string }
        apiVersion: number
    }) {
        this.name = name
        this.apiVersion = apiVersion
        this.action = action.toUpperCase()
        this.parameters = parameters
        this.statusCode = 0
    }

    public async init() {
        switch (this.action) {
            case "DELETE":
                this.statusCode = StatusCode.noContent
                await this.delete()
                break
            case "GET":
                this.statusCode = StatusCode.ok
                await this.get()
                break
            case "POST":
                this.statusCode = StatusCode.created
                await this.post()
                break
            default:
                this.statusCode = StatusCode.badRequest
                this.invalidAction()
                break
        }
    }

    private invalidAction(): void {
        this.statusCode = StatusCode.badRequest
        this.rowsAffected = 0
        this.response = "{}"
    }

    protected returnError({
        error,
        output,
    }: {
        error: Error
        output: { [key: string]: any }
    }): void {
        output.error = error
        this.response = JSON.stringify(output)
        this.statusCode = StatusCode.badRequest
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

    public getParameters(): { [key: string]: string } {
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

    public getApiVersion(): number {
        return this.apiVersion
    }
}

/* eslint-disable no-magic-numbers, no-shadow, no-unused-vars */
enum StatusCode {
    ok = 200,
    created = 201,
    noContent = 204,
    badRequest = 400,
}
/* eslint-enable no-magic-numbers, no-shadow, no-unused-vars */

export { Endpoint, StatusCode }
