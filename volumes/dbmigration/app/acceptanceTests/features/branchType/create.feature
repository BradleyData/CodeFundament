Feature: The database can be created using different Branch Types
    If a database already exists, it is replaced

    Scenario: Drop an existing database first
        Given a database exists
        When creating a new database
        Then drop the existing database first

    Scenario Outline: Create a new database using the correct schema
        Given a database does not exist
        When creating a new database using <branchType>
        Then the schema <schemaFile> is updated
        And a database is created from schema <schemaFile>

        Scenarios:
            | branchType  | schemaFile       |
            | current     | schema           |
            | branchpoint | schema           |
            | production  | schemaproduction |