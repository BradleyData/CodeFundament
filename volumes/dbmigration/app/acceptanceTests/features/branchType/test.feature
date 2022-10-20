Feature: All acceptance tests for a Branch Type can be run using the associated database

    Scenario Outline:
        When running acceptance tests against <branchType>
        Then the code and acceptance tests associated with <branchType> are pulled from the repository
        And the schema <schemaFile> is updated
        And the acceptance tests are run

        Scenarios:
            | branchType  | schemaFile       |
            | current     | schema           |
            | branchpoint | schema           |
            | production  | schemaproduction |