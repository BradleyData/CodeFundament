#!/usr/bin/env bash

mkdir --parents /home/node/app/output/acceptance/html
mkdir --parents /home/node/app/output/acceptance/json

cp /home/node/config/cucumber.js /home/node/
cp /home/node/config/tsconfig.json /home/node/
cucumber-js
rm -f /home/node/cucumber.js
rm -f /home/node/tsconfig.json

node /home/node/config/cucumberHtmlReporter.mjs
