"use strict";

const BrowserSync = require('browser-sync').create()
const Gulp = require("gulp")
const {exec} = require("child_process")

function buildPatternLab(cb) {
    exec("npm run pl:build")
    cb()
}

function compileSass(cb) {
    exec("npm run sass")
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
            Gulp.parallel(buildPatternLab, compileSass),
            reloadBrowser
        )
    )
}