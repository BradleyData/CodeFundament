Feature: The database connection works

    Scenario: Database connection test
        When the API attempts to connect to the database
        Then the database connection is successful