class Endpoint {
    protected name: string
    protected readonly action: string
    protected readonly parameters: { [key: string]: string }
    protected response = ""
    private statusCode: StatusCode

    constructor({
        action,
        name,
        parameters,
    }: {
        action: string
        name: string
        parameters: { [key: string]: string }
    }) {
        this.name = name
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
        this.response = ""
    }

    protected returnError({
        error,
        output,
    }: {
        error: any
        output: { [key: string]: any }
    }): void {
        output.error = {
            message: error.message ?? error.toString(),
            name: error.name ?? "Non-error Object",
            stack: error.stack ?? [],
        }
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

    public getStatusCode(): number {
        return this.statusCode
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
