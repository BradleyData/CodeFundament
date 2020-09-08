Feature: The database connection works

    Scenario: Database connection test
        When the API attempts to connect to postgres
        Then the postgres connection is successful