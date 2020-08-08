#!/usr/bin/env bash
echo "Updating the npm package lockfile."
cp update/package.json .
npm install
npm audit fix
cp package-lock.json update/

echo "Update complete!"
