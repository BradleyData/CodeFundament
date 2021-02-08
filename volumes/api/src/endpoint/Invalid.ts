import { Endpoint } from "../Endpoint"

class Invalid extends Endpoint {
    private execute(): void {
        this.name = "Invalid"
        this.version = 1
        super.get()
    }
    protected async delete(): Promise<void> {
        await this.execute()
    }

    protected async get(): Promise<void> {
        await this.execute()
    }

    protected async post(): Promise<void> {
        await this.execute()
    }
}

export { Invalid, Invalid as Endpoint }
