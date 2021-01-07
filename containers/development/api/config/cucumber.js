let common = [
    "app/acceptanceTests/features/**/*.feature",
    "--require-module ts-node/register",
    "--require app/acceptanceTests/steps/**/*.test.ts",
    "--publish-quiet",
    "--format progress-bar",
    "--format html:app/output/acceptance/index.html"
].join(" ")

module.exports = {
    default: common
}
