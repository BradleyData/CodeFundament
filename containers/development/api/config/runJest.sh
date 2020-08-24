#!/usr/bin/env bash

cp /home/node/config/jest.config.js /home/node/
cp /home/node/config/tsconfig.json /home/node/
jest --detectOpenHandles
rm -f /home/node/jest.config.js
rm -f /home/node/tsconfig.json
