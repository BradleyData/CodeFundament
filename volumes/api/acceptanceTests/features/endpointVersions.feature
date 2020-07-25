Feature: Endpoint Versions and the Default Endpoint

    Scenario Outline: Default endpoint works
        When <action> is attempted on "<url>"
        Then the endpoint <name>(<version>) is used
            And is passed "<parameters>"
            And it provides an HTTP <status> code
            And the number of <rows> affected
            And the json "<response>"
            

        Examples:
            | url                | action | name            | version | parameters     | status | rows | response |
            |                    | DELETE | Default         |       3 |                |    204 |    0 | {}       |
            |                    | GET    | Default         |       3 |                |    200 |    0 | {}       |
            |                    | POST   | Default         |       3 |                |    201 |    0 | {}       |
            | /                  | GET    | Default         |       3 |                |    200 |    0 | {}       |
            | /Default           | GET    | Default         |       3 |                |    200 |    0 | {}       |
            | /Default/extra     | GET    | Default         |       3 | extra          |    200 |    0 | {}       |
            | /nonexistent       | GET    | Default         |       3 | nonexistent    |    200 |    0 | {}       |
            | /does/n0t/exist    | GET    | Default         |       3 | does/n0t/exist |    200 |    0 | {}       |
            | /v1                | GET    | Default         |       1 |                |    200 |    0 | {}       |
            | /v1/Default        | GET    | Default         |       1 |                |    200 |    0 | {}       |
            | /v1/does/n0t/exist | GET    | Default         |       1 | does/n0t/exist |    200 |    0 | {}       |
            | /v2                | GET    | Default         |       1 |                |    200 |    0 | {}       |
            | /v3                | GET    | Default         |       3 |                |    200 |    0 | {}       |
            | /v3/               | GET    | Default         |       3 |                |    200 |    0 | {}       |
            | /v3/Default        | GET    | Default         |       3 |                |    200 |    0 | {}       |
            | /v3/does/n0t/exist | GET    | Default         |       3 | does/n0t/exist |    200 |    0 | {}       |
            | /v4                | GET    | Default         |       3 |                |    200 |    0 | {}       |
            | /Default/Default   | GET    | Default/Default |       2 |                |    200 |    0 | {}       |