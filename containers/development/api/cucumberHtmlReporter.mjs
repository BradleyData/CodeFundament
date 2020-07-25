import chr from "cucumber-html-reporter"

chr.generate({
    theme: "bootstrap",
    jsonFile: "app/output/acceptance/acceptance.json",
    output: "app/output/acceptance/acceptance.html",
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false
})