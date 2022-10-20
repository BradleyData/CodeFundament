Feature: A schema can be updated
    If the schema does not already exist, a default is created

    Scenario Outline: A default schema is created when none exists
        Given a schema <schemaFile> does not exist
        When updating the schema <schemaFile>
        Then the schema <schemaFile> is created

        Scenarios:
            | schemaFile       |
            | schema           |
            | schemaproduction |

    Scenario: A schema is updated by grabbing the latest repository version and applying migrations
        Given a schema <schemaFile> exists
        When updating the schema <schemaFile>
        Then the schema <schemaFile> is copied from the repository
        And all migrations are applied in order

        Scenarios:
            | schemaFile       |
            | schema           |
            | schemaproduction |