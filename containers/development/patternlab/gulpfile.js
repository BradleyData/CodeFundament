"use strict";

const BrowserSync = require('browser-sync').create()
const Gulp = require("gulp")
const {exec} = require("child_process")

function clean(cb) {
    exec("npm run clean")
    cb()
}

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

function compileTypescript(cb) {
    exec("npm run compileTypescript")
    cb()
}

function afterCompile(cb) {
    // Without the delay things manage to load stale files.
    setTimeout(() => {
        BrowserSync.reload()
        exec("npm run export")
    }, 2000)
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
            Gulp.parallel(clean, lint),
            Gulp.parallel(buildPatternLab, compileSass, compileTypescript),
            afterCompile
        )
    )
}