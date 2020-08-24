import chr from "multiple-cucumber-html-reporter"

chr.generate({
    jsonDir: "/home/node/app/output/acceptance/json/",
    reportPath: "/home/node/app/output/acceptance/html/",
    metadata: {
        device: "Development environment",
        platform: {
            name: "linux"
        }
    }
})
