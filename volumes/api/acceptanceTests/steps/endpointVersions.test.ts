// eslint-disable-next-line no-unused-vars
import Endpoint from "../../src/Endpoint"
import expect from "expect"
import Srvr from "../../src/Srvr"
import { When, Then } from "cucumber"

let endpoint: Endpoint

When('{word} is attempted on {string}', (action: string, url: string) => {
    const srvr = new Srvr()
    endpoint = srvr.createEndpoint(action, url)
})

Then("the endpoint {string} with version {int} is used", (name: string, version: number) => {
    expect(name).toBe(endpoint.getName())
    expect(version).toBe(endpoint.getVersion())
})

Then('is passed parameters {string}', (parameters: string) => {
    expect(parameters).toBe(endpoint.getParameters())
})

Then("it provides an HTTP status code of {int}", (status: number) => {
    expect(status).toBe(endpoint.getStatusCode())
})

Then("the number of rows affected is {int}", (rows: number) => {
    expect(rows).toBe(endpoint.getRowsAffected())
})

Then('the json output is {string}', (response: string) => {
    expect(response).toBe(endpoint.getResponse())
})
