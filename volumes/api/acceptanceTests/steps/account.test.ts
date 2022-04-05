import { Given, Then, When } from "@cucumber/cucumber"
import { Account } from "../../src/api/Account"
import { expect } from "chai"

let account: Account
let username: string
let existsBeforeCreate: boolean
let createSucceeds: boolean
let existsAfterCreate: boolean

Given("the username is available", async () => {
    account = new Account()
    username = "UsernameForTestingAccountCreationWithAvailableUsername"

    if (await account.usernameExists({ username }) === true)
        await account.delete({ username })
})

Given("the username is unavailable", async () => {
    account = new Account()
    username = "UsernameForTestingAccountCreationWithUnavailableUsername"

    if (await account.usernameExists({ username }) === false)
        await account.create({ username })
})

When("a person attempts to create an account", async () => {
    existsBeforeCreate = await account.usernameExists({ username })
    createSucceeds = await account.create({ username })
    existsAfterCreate = await account.usernameExists({ username })
})

Then("the username is created", () => {
    expect(existsBeforeCreate).to.be.false
    expect(createSucceeds).to.be.true
    expect(existsAfterCreate).to.be.true
})

Then("they are informed the username is unavailable", () => {
    expect(existsBeforeCreate).to.be.true
    expect(createSucceeds).to.be.false
    expect(existsAfterCreate).to.be.true
})
