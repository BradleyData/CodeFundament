let common = [
    'app/acceptanceTests/features/**/*.feature',
    '--require-module ts-node/register',
    '--require app/acceptanceTests/steps/**/*.ts',
    '--format progress-bar',
    '--format json:app/output/acceptanceTests.json',
].join(' ');

module.exports = {
    default: common
}
