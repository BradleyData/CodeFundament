#!/usr/bin/env bash
echo "Updating the npm package lockfile."
cp update/package.json .
npm install
cp package-lock.json update/

echo "Update complete!"
