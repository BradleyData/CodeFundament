import { Branch } from "../Branch"
import { Endpoint } from "../Endpoint"
import { Git } from "../wrapperUnshared/Git"

class Test extends Endpoint {
    protected async get(): Promise<void> {
        const branchType: Git.branchType =
            Git.branchType[this.parameters.branchType as Git.branchType] ??
            Git.branchType.current
        const content = await Branch.runTests({ branchType })
        this.response = `<html><body>${contentToString()}</body></html>`

        function contentToString(): string {
            return content.reduce((current, addend) => {
                return `${current}<br>${addend}`
            })
        }
    }
}

export { Test, Test as Endpoint }
