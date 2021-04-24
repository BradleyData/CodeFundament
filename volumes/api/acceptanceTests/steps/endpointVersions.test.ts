import { Then, When } from "@cucumber/cucumber"
import { Convert } from "../../src/Convert"
import { Endpoint } from "../../src/Endpoint"
import { Srvr } from "../../src/Srvr"
import expect from "expect"

let endpoint: Endpoint

When("{word} is attempted on {string}", async (action: string, url: string) => {
    const srvr = new Srvr()
    endpoint = await srvr.createEndpoint({ action, url })
})

Then(
    "the endpoint {string} with version {int} is used",
    (name: string, version: number) => {
        expect(name).toBe(endpoint.getName())
        expect(version).toBe(endpoint.getVersion())
    }
)

Then("is passed parameters {string}", (urlParameters: string) => {
    const convertedParameters = Convert.urlParametersToObject({ urlParameters })
    expect(convertedParameters).toStrictEqual(endpoint.getParameters())
})

Then("it provides an HTTP status code of {int}", (status: number) => {
    expect(status).toBe(endpoint.getStatusCode())
})

Then("the number of rows affected is {int}", (rows: number) => {
    expect(rows).toBe(endpoint.getRowsAffected())
})

Then("the json output is {string}", (response: string) => {
    expect(response).toBe(endpoint.getResponse())
})
