let common = [
    "app/acceptanceTests/features/**/*.feature",
    "--require-module ts-node/register",
    "--require app/acceptanceTests/steps/**/*.test.ts",
    "--publish-quiet",
    "--parallel 10",
    "--format progress-bar",
    "--format html:app/output/acceptance/index.html"
].join(" ")

module.exports = {
    default: common
}
