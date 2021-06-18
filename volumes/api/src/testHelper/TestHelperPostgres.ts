import { QueryResult } from "pg"
import Sinon from "sinon"
import { expect } from "chai"

export class TestHelperPostgres {
    static expectQueryExists({
        queryStub,
        queryType,
        withValues,
    }: {
        queryStub: any
        queryType: string
        withValues?: any
    }): void {
        const sql = Sinon.match(getRegex())

        /* eslint-disable no-undefined */
        const match =
            withValues === undefined ? { sql } : { sql, values: withValues }
        /* eslint-enable no-undefined */

        expect(queryStub).to.be.calledOnce.and.calledWithMatch(match)

        function getRegex(): RegExp {
            if (queryType === "SELECT") 
                return /^SELECT.*$/u
            if (queryType === "INSERT") 
                return /^INSERT.*$/u
            if (queryType === "UPDATE") 
                return /^UPDATE.*$/u

            return /^$/u
        }
    }

    static queryResultMock({ rows }: { rows: Array<any> }): QueryResult {
        return {
            command: "",
            fields: [],
            oid: 0,
            rowCount: 0,
            rows,
        }
    }
}
