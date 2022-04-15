"use strict"

module.exports = {
    "check-leaks": true,
    "enable-source-maps": true,
    "parallel": true,
    "recursive": true,
    "slow": 1000,
    "require": [
        "ts-node/register",
        "reflect-metadata"
    ],
    "extension": [
        ".test.ts"
    ],
    "spec": [
        "app/src/"
    ],
}
