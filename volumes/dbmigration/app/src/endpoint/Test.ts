import { Branch } from "../Branch"
import { Endpoint } from "../Endpoint"
import { Git } from "../wrapperUnshared/Git"

class Test extends Endpoint {
    protected async get(): Promise<void> {
        this.response = "<html><body>"
        /* eslint-disable guard-for-in, no-await-in-loop */
        if ((this.parameters.branchType ?? "") === "") {
            for (const bt in Git.branchType) {
                this.response += `${await testBranch({
                    branchType: bt as Git.branchType,
                })}<br><br>`
            }
        } else {
            this.response += await testBranch({
                branchType:
                    Git.branchType[
                        this.parameters.branchType as Git.branchType
                    ] ?? Git.branchType.current,
            })
        }
        /* eslint-enable guard-for-in, no-await-in-loop */

        this.response += "</body></html>"

        async function testBranch({
            branchType,
        }: {
            branchType: Git.branchType
        }): Promise<string> {
            const content = await Branch.runTests({ branchType })
            return contentToString()

            function contentToString(): string {
                return content.reduce((current, addend) => {
                    return `${current}<br>${addend}`
                })
            }
        }
    }
}

export { Test, Test as Endpoint }
