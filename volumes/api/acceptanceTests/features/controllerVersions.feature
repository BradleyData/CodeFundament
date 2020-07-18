Feature: Controller Versions and the Default Controller

    Scenario Outline: Default controller works
        When <action> is attempted on "<endpoint>"
        Then the controller <name> with <version> is used
            And it provides an HTTP <status> code
            And the number of <rows> affected
            And the json "<response>"

        Examples:
            | endpoint           | action | name       | version | status | rows | response |
            |                    | delete | Default    |       1 |    204 |    0 | {}       |
            |                    | get    | Default    |       1 |    200 |    0 | {}       |
            |                    | post   | Default    |       1 |    201 |    0 | {}       |
            | /                  | get    | Default    |       1 |    200 |    0 | {}       |
            | /default           | get    | Default    |       1 |    200 |    0 | {}       |
            | /nonexistent       | get    | Default    |       1 |    200 |    0 | {}       |
            | /does/n0t/exist    | get    | Default    |       1 |    200 |    0 | {}       |
            | /v1                | get    | Default    |       1 |    200 |    0 | {}       |
            | /v1/default        | get    | Default    |       1 |    200 |    0 | {}       |
            | /v1/does/n0t/exist | get    | Default    |       1 |    200 |    0 | {}       |
            | /v2                | get    | Default    |       2 |    200 |    0 | {}       |
            | /v2/               | get    | Default    |       2 |    200 |    0 | {}       |
            | /v2/default        | get    | Default    |       2 |    200 |    0 | {}       |
            | /v2/does/n0t/exist | get    | Default    |       2 |    200 |    0 | {}       |
            | /v3                | get    | Default    |       2 |    200 |    0 | {}       |