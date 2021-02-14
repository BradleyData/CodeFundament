import { Endpoint, StatusCode } from "../Endpoint"
import { Postgres } from "../wrapper/Postgres"
import { QueryResult } from "pg"

export class TestHelperPostgres {
    static expectBadRequest({
        endpoint,
        errorMsg,
        responseKey,
        responseValue,
    }: {
        endpoint: Endpoint
        errorMsg: string
        responseKey: string
        responseValue: any
    }): void {
        const response = JSON.parse(endpoint.getResponse())

        expect(endpoint.getStatusCode()).toBe(StatusCode.badRequest)
        expect(endpoint.getRowsAffected()).toBe(0)
        expect(response.error).toBe(errorMsg)
        expect(response[responseKey]).toBe(responseValue)
    }

    static expectQueryExists({ queryType }: { queryType: string }): void {
        expect(Postgres.query).toBeCalledWith(
            expect.stringContaining(queryType),
            expect.arrayContaining([expect.any(String)]),
            expect.any(Function)
        )
    }

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
}
