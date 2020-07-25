import { defineFeature, loadFeature } from "jest-cucumber"
// eslint-disable-next-line no-unused-vars
import Endpoint from "../../src/Endpoint"
import Srvr from "../../src/Srvr"

const feature = loadFeature(
    "./app/acceptanceTests/features/endpointVersions.feature"
)

defineFeature(feature, (test) => {
    test("Default endpoint works", ({ when, then }) => {
        let endpoint: Endpoint

        when(
            /^(?<action>.+) is attempted on "(?<url>.*)"$/u,
            (action: string, url: string) => {
                const srvr = new Srvr()
                endpoint = srvr.createEndpoint(action, url)
            }
        )

        then(
            /^the endpoint (?<name>.+)\((?<version>[0-9]+)\) is used$/u,
            (name: string, version: string) => {
                expect(name).toBe(endpoint.getName())
                expect(version).toBe(endpoint.getVersion().toString())
            }
        )

        then(/^is passed "(?<parameters>.*)"$/u, (parameters: string) => {
            expect(parameters).toBe(endpoint.getParameters())
        })

        then(
            /^it provides an HTTP (?<status>[0-9]+) code$/u,
            (status: string) => {
                expect(status).toBe(endpoint.getStatusCode().toString())
            }
        )

        then(/^the number of (?<rows>[0-9]+) affected$/u, (rows: string) => {
            expect(rows).toBe(endpoint.getRowsAffected().toString())
        })

        then(/^the json "(?<response>.*)"$/u, (response: string) => {
            expect(response).toBe(endpoint.getResponse())
        })
    })
})
