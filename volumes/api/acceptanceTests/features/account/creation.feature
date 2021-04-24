Feature: A person can create a new account

    Scenario: A person without an account
        When a person attempts to create an account
        Then an account is created