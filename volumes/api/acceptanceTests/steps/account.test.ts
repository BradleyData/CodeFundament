import { Given, Then, When } from "@cucumber/cucumber"
import { Account } from "../../src/graphql/resolver/Account"
import { expect } from "chai"

let account: Account
let username: string
let existsBeforeCreate: boolean
let createSucceeds: boolean
let existsAfterCreate: boolean

Given("the username is available", async () => {
    account = new Account()
    username = "UsernameForTestingAccountCreationWithAvailableUsername"

    if (await account.UsernameExists(username) === true)
        await account.Delete({ username })
})

Given("the username is unavailable", async () => {
    account = new Account()
    username = "UsernameForTestingAccountCreationWithUnavailableUsername"

    if (await account.UsernameExists(username) === false)
        await account.Create(username)
})

When("a person attempts to create an account", async () => {
    existsBeforeCreate = await account.UsernameExists(username)
    createSucceeds = await account.Create(username)
    existsAfterCreate = await account.UsernameExists(username)
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
