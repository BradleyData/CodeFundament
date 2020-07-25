import Endpoint from "../Endpoint"

export default class Invalid extends Endpoint {
    private execute(): void {
        this.name = "Invalid"
        this.version = 1
        super.get()
    }
    protected delete(): void {
        this.execute()
    }

    protected get(): void {
        this.execute()
    }

    protected post(): void {
        this.execute()
    }
}
