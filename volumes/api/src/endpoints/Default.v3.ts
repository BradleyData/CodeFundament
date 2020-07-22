import Endpoint from "../Endpoint"

export default class Default extends Endpoint {
    protected delete(): void {
        this.rowsAffected = 0
        this.response = "{}"
    }

    protected get(): void {
        this.rowsAffected = 0
        this.response = "{}"
    }

    protected post(): void {
        this.rowsAffected = 0
        this.response = "{}"
    }
}
