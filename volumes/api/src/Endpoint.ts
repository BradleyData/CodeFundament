export default class {
    protected name = ""
    protected version = 0
    protected rowsAffected = 0
    protected response = "{}"
    protected readonly action: string
    protected readonly parameters: string

    constructor(action: "delete" | "get" | "post", parameters: string) {
        this.action = action
        this.parameters = parameters
        this.doStuff()
    }

    protected doStuff(): void {}

    public getName(): string {
        return this.name
    }

    public getVersion(): number {
        return this.version
    }

    public getRowsAffected(): number {
        return this.rowsAffected
    }

    public getResponse(): string {
        return this.response
    }

    public getAction(): string {
        return this.action
    }

    public getParameters(): string {
        return this.parameters
    }
}
