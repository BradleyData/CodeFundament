Feature: An account can be created

    Scenario: A person creates an account
        Given the username is available
        When a person attempts to create an account
        Then the username is created

    Scenario: A person creates an account
        Given the username is unavailable
        When a person attempts to create an account
        Then they are informed the username is unavailable