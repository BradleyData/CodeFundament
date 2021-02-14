import { Then, When } from "@cucumber/cucumber"
import { Endpoint } from "../../../src/Endpoint"
import { Srvr } from "../../../src/Srvr"
import expect from "expect"

let endpoint: Endpoint

When("a person attempts to create an account", async () => {
    const srvr = new Srvr()
    endpoint = await srvr.createEndpoint({
        action: "post",
        url: "account/Create",
    })
})

Then("an account is created", () => {
    expect(endpoint.getResponse()).toBe("halleluja")
    // expect(endpoint.getResponse()).toBe(JSON.stringify({ postgres: true }))
})
