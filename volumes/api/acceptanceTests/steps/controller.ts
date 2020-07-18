import { binding, then , when } from 'cucumber-tsflow'
import chai from 'chai'

@binding()
export class ControllerTestSteps {
    private action:string = ''
    private endpoint:string = ''

    @when('{word} is attempted on {string}')
    public whenController(action: string, endpoint: string) {
        this.action = action
        this.endpoint = endpoint
    }

    @then('the controller {word} with {int} is used')
    public thenControllerNameAndVersion(controller: string, version: number) {
        chai.expect(controller).to.equal('Default')
        chai.expect(version).to.equal(1)
    }

    @then('it provides an HTTP {int} code')
    public thenControllerStatusCode(status:number) {
        chai.expect(status).to.equal(200)
    }

    @then('the number of {int} affected')
    public thenControllerRows(rows: number) {
        chai.expect(rows).to.equal(0)
    }

    @then('the json {string}')
    public thenControllerJson(json: string) {
        chai.expect(json).to.equal('{}')
    }

    @then('unused')
    public deleteMeLater() {
        chai.expect(this.action).to.equal('')
        chai.expect(this.endpoint).to.equal('')
    }
}