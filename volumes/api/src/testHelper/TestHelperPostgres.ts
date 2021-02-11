import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"

export class TestHelperPostgres {
    /* eslint-disable no-unused-vars */
    static queryMock(
        rowsAffected: number,
        errorMsg: string,
        getRows: (values?: any) => Array<any>,
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

                    useResults(this.queryResultsMock(getRows(values)))
                    return Promise.resolve(rowsAffected)
                }
            )
    }
    /* eslint-ensable no-unused-vars */

    static queryResultsMock(rows: Array<any>): QueryResult {
        return {
            command: "",
            fields: [],
            oid: 0,
            rowCount: 0,
            rows: rows,
        }
    }

    static verifyQueryExists(queryType: string): void {
        expect(Postgres.query).toBeCalledWith(
            expect.stringContaining(queryType),
            expect.arrayContaining([expect.any(String)]),
            expect.any(Function)
        )
    }
}
