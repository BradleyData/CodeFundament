Feature: A migration can be added

    Background:
        Given we are using a feature branch named for the git Issue being developed

    Scenario:
        Given there is no directory for the current Issue
        When a migration is added
        Then a directory named for the current Issue is created
        And an empty index file is added to the Issue directory

    Scenario:
        When a migration is added with a title
        Then a migration file named with the title is created and stored in the Issue directory
        And the migration file name is appended to the index file