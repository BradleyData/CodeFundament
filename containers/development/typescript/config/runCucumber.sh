#!/usr/bin/env bash

mkdir --parents /home/node/app/output/acceptance

cp /home/node/config/cucumber.js /home/node/
cp /home/node/config/tsconfig.json /home/node/
cucumber-js
result=$?
rm -f /home/node/cucumber.js
rm -f /home/node/tsconfig.json

exit $result