import Endpoint from "../Endpoint"

export default class extends Endpoint {
    protected doStuff(): void {
        this.name = "Default"
        this.version = 3
    }
}
