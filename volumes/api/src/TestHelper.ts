import { QueryResult } from "pg"

export class TestHelper {
    static randomInt = () => {
        const maxRandomInt = 100

        return Math.floor(Math.random() * maxRandomInt)
    }

    /* eslint-disable no-unused-vars */
    static getPostgresQueryMock(
        rowsAffected: number,
        errorMsg: string,
        getQueryResults: (expected: boolean, values?: any) => QueryResult,
        expected?: boolean
    ): jest.Mock {
        return jest
            .fn()
            .mockImplementation(
                (
                    sql: string,
                    values: any,
                    useResults: (queryResult: QueryResult) => void
                ) => {
                    // eslint-disable-next-line no-param-reassign, no-self-assign
                    sql = sql

                    // eslint-disable-next-line no-undefined
                    if (expected === undefined) 
                        throw errorMsg

                    useResults(getQueryResults(expected, values))
                    return Promise.resolve(rowsAffected)
                }
            )
    }
    /* eslint-ensable no-unused-vars */
}
