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
        expect(response.error.message).toBe(errorMsg)
        expect(response[responseKey]).toBe(responseValue)
    }

    static expectQueryExists({
        queryType,
        withValues,
    }: {
        queryType: string
        withValues?: any
    }): void {
        const queryParams: Record<string, any> = {
            sql: expect.stringContaining(queryType),
            values: expect.arrayContaining([expect.any(String)]),
        }
        if (queryType === "SELECT")
            queryParams.useResults = expect.any(Function)
        // eslint-disable-next-line no-undefined
        if (withValues !== undefined) 
            queryParams.values = withValues

        expect(Postgres.query).toBeCalledWith(queryParams)
    }

    /* eslint-disable no-unused-vars */
    static queryMock({
        errorMsg,
        expected,
        getRows,
        rowsAffected,
    }: {
        errorMsg: string
        expected?: boolean
        getRows: (values?: any) => Array<any>
        rowsAffected: number
    }): jest.Mock {
        return jest
            .fn()
            .mockImplementation(
                ({
                    sql,
                    values,
                    useResults,
                }: {
                    sql: string
                    values: any
                    useResults: ({
                        queryResult,
                    }: {
                        queryResult: QueryResult
                    }) => void
                }) => {
                    // eslint-disable-next-line no-param-reassign, no-self-assign
                    sql = sql

                    // eslint-disable-next-line no-undefined
                    if (expected === undefined) 
                        throw errorMsg

                    // eslint-disable-next-line no-undefined
                    if (useResults !== undefined) {
                        useResults({
                            queryResult: this.queryResultsMock({
                                rows: getRows(values),
                            }),
                        })
                    }
                    return Promise.resolve(rowsAffected)
                }
            )
    }
    /* eslint-ensable no-unused-vars */

    static queryResultsMock({ rows }: { rows: Array<any> }): QueryResult {
        return {
            command: "",
            fields: [],
            oid: 0,
            rowCount: 0,
            rows: rows,
        }
    }
}
