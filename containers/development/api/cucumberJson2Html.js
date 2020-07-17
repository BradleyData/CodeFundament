let yachr = require("yachr")
let reporter = new yachr.Reporter()

reporter.generate({
    jsonFile: 'app/output/acceptanceTests.json',
    output: 'app/output/acceptanceTests.htm'
})