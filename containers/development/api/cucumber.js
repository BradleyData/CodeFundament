let common = [
    "app/acceptanceTests/features/**/*.feature",
    "--require-module ts-node/register",
    "--require app/acceptanceTests/steps/**/*.test.ts",
    "--format progress-bar",
    "--format node_modules/cucumber-pretty",
    "--format json:app/output/acceptance/json/acceptance.json"
].join(" ")

module.exports = {
    default: common
}