"use strict";

const BrowserSync = require('browser-sync').create()
const Gulp = require("gulp")
const {exec} = require("child_process")

function lint(cb) {
    exec("npm run lint")
    cb()
}

function buildPatternLab(cb) {
    exec("npm run buildPatternLab")
    cb()
}

function compileSass(cb) {
    exec("npm run compileSass")
    cb()
}

function reloadBrowser(cb) {
    // This runs after everything is built, but without a delay it manages to load stale files.
    setTimeout(() => BrowserSync.reload(), 2000)
    cb()
}

exports.default = function() {
    BrowserSync.init({
        open: false,
        server: {
            baseDir: "app/www"
        }
    })
    Gulp.watch(
        "app/src/**/*.*",
        {ignoreInitial: false},
        Gulp.series(
            lint,
            Gulp.parallel(buildPatternLab, compileSass),
            reloadBrowser
        )
    )
}