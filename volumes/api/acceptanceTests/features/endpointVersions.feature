Feature: Endpoint Versions and the Default Endpoint

    Scenario Outline: Default endpoint works
        When <action> is attempted on "<url>"
        Then the endpoint <name> with <version> is used
            And it provides an HTTP <status> code
            And the number of <rows> affected
            And the json "<response>"
            

        Examples:
            | url                | action | name       | version | status | rows | response |
            |                    | delete | Default    |       3 |    204 |    0 | {}       |
            |                    | get    | Default    |       3 |    200 |    0 | {}       |
            |                    | post   | Default    |       3 |    201 |    0 | {}       |
            | /                  | get    | Default    |       3 |    200 |    0 | {}       |
            | /default           | get    | Default    |       3 |    200 |    0 | {}       |
            | /nonexistent       | get    | Default    |       3 |    200 |    0 | {}       |
            | /does/n0t/exist    | get    | Default    |       3 |    200 |    0 | {}       |
            | /v1                | get    | Default    |       1 |    200 |    0 | {}       |
            | /v1/default        | get    | Default    |       1 |    200 |    0 | {}       |
            | /v1/does/n0t/exist | get    | Default    |       1 |    200 |    0 | {}       |
            | /v2                | get    | Default    |       1 |    200 |    0 | {}       |
            | /v3                | get    | Default    |       3 |    200 |    0 | {}       |
            | /v3/               | get    | Default    |       3 |    200 |    0 | {}       |
            | /v3/default        | get    | Default    |       3 |    200 |    0 | {}       |
            | /v3/does/n0t/exist | get    | Default    |       3 |    200 |    0 | {}       |
            | /v4                | get    | Default    |       3 |    200 |    0 | {}       |