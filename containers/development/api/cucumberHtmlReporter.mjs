import chr from "multiple-cucumber-html-reporter"

chr.generate({
    jsonDir: "./app/output/acceptance/json/",
    reportPath: "./app/output/acceptance/html/",
    metadata: {
        device: "Development environment",
        platform: {
            name: "linux"
        }
    }
})
