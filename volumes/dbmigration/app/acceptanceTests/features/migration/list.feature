Feature: Any migrations can be listed in order

    Background:
        Given we are using a feature branch named for the git Issue being developed

    Scenario:
        Given there is no directory for the current Issue
        When a list of migrations is requested
        Then an empty list is returned

    Scenario:
        Given there is a directory for the current Issue
        And there is an index file in the directory for the current Issue
        When a list of migrations is requested
        Then the list of migration file names in the index file is returned