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
    setTimeout(() => BrowserSync.reload(), 1000)
    cb()
}

exports.default = function() {
    BrowserSync.init({
        open: false,
        server: {
            baseDir: "app/public"
        }
    })
    Gulp.watch(
        "app/source/**/*.*",
        {ignoreInitial: false},
        Gulp.series(
            lint,
            Gulp.parallel(buildPatternLab, compileSass),
            reloadBrowser
        )
    )
}