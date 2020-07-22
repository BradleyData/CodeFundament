import { defineFeature, loadFeature } from "jest-cucumber"

const feature = loadFeature(
    "./app/acceptanceTests/features/controllerVersions.feature"
)

defineFeature(feature, (test) => {
    test("Default controller works", ({ when, then }) => {
        let controller: string

        when(
            /^(?<action>.+) is attempted on "(?<endpoint>.*)"$/u,
            (action: string, endpoint: string) => {
                controller = `${action} on ${endpoint}`
                expect(controller).not.toBe("")
            }
        )

        then(
            /^the controller (?<name>.+) with (?<version>[0-9]+) is used$/u,
            (name: string, version: string) => {
                expect(name).toBe("Default")
                expect(version).toBe("1")
            }
        )

        then(
            /^it provides an HTTP (?<status>[0-9]+) code$/u,
            (status: string) => {
                expect(status).toBe("200")
            }
        )

        then(/^the number of (?<rows>[0-9]+) affected$/u, (rows: string) => {
            expect(rows).toBe("0")
        })

        then(/^the json "(?<response>.*)"$/u, (response: string) => {
            expect(response).toBe("{}")
        })
    })
})
