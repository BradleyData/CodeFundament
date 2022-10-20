Feature: A migration can be removed or renamed
    The order of migrations can be changed

    Background:
        Given we are using a feature branch named for the git Issue being developed
        And there is a directory for the current Issue
        And there is an index file in the directory for the current Issue
        And there is at least one migration in a directory for the current Issue

    Scenario:
        When a migration is removed
        Then the migration file is deleted
        And the migration file name is removed from the index file

    Scenario:
        When a migration is renamed
        Then the migration file is renamed
        And the migration file name is changed in the index file

    Scenario:
        When the order of migrations is changed
        Then the order of migration file names in the index file is changed